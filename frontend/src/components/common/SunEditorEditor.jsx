import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditorEditor = forwardRef(function SunEditorEditor({ value, onChange, placeholder }, ref) {
  const editorRef = useRef(null);
  const base64ToFileMapRef = useRef(new Map());

  useImperativeHandle(ref, () => ({
    getBase64Images: () => base64ToFileMapRef.current,
    getAllBase64ImagesInContent: () => {
      const editor = editorRef.current;
      if (!editor) return new Map();

      const content = editor.getContents(true);
      const base64Images = new Map();
      const base64Regex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;

      let match;
      while ((match = base64Regex.exec(content)) !== null) {
        const base64Src = match[1];
        if (base64ToFileMapRef.current.has(base64Src)) {
          base64Images.set(base64Src, base64ToFileMapRef.current.get(base64Src));
        }
      }

      return base64Images;
    },
    getContentWithRelativeUrls: () => {
      const editor = editorRef.current;
      if (!editor) return '';

      const content = editor.getContents(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';

      return content.replace(
        /<img([^>]+)src="([^"]+)"([^>]*>)/g,
        (match, beforeSrc, src, afterSrc) => {
          if (src.startsWith('data:')) {
            return match;
          }

          if (baseUrl && src.startsWith(baseUrl)) {
            const relativePath = src.substring(baseUrl.length);
            return `<img${beforeSrc}src="${relativePath}"${afterSrc}`;
          }

          return match;
        },
      );
    },
  }));

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGetInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  const handleImageUploadBefore = async (files, info, uploadHandler) => {
    if (!files || files.length === 0) {
      return undefined;
    }

    try {
      const file = files[0];

      const base64String = await fileToBase64(file);

      base64ToFileMapRef.current.set(base64String, file);

      const response = {
        result: [
          {
            url: base64String,
            name: file.name,
            size: file.size,
          },
        ],
      };

      uploadHandler(response);

      return false;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      return false;
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.getContents(true)) {
      editor.setContents(value || '');
    }
  }, [value]);

  useEffect(() => {
    return () => {
      base64ToFileMapRef.current.clear();
    };
  }, []);

  return (
    <div className="editor-scope">
      <SunEditor
        getSunEditorInstance={handleGetInstance}
        onChange={onChange}
        onImageUploadBefore={handleImageUploadBefore}
        setDefaultStyle="font-family: 'Poppins', sans-serif; font-size: 15px; line-height: 1.8;"
        setOptions={{
          minHeight: '400px',
          placeholder: placeholder || 'Nhập mô tả sự kiện...',
          buttonList: [
            ['undo', 'redo'],
            ['formatBlock'],
            ['bold', 'italic', 'underline', 'removeFormat'],
            ['align', 'list', 'outdent', 'indent'],
            ['link', 'image', 'table'],
            ['fullScreen', 'codeView', 'preview'],
          ],
        }}
      />
    </div>
  );
});

export default SunEditorEditor;
