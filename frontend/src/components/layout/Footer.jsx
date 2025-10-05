import { faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faInbox,
  faLocationDot,
  faPhone,
  faPlay,
  faZ,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(135deg,#1e88e5_0%,#0d47a1_10 bg-secondary relative overflow-hidden py-5 pt-10 text-white">
      <div className="absolute top-0 right-0 left-0 h-1 bg-[linear-gradient(90deg,#fbc02d,#e53935,#43a047,#1e88e5)]"></div>
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-7 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-10">
          <div className="text-center md:text-start">
            <div className="mb-5 flex items-center gap-4">
              <img
                src="/mini-logo.png"
                alt="VKU Logo"
                className="h-auto w-[5vw] p-1"
              />
            </div>
            <p className="text-sm leading-normal text-blue-200">
              Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực CNTT, hướng
              tới sự phát triển bền vững và hội nhập quốc tế.
            </p>
            <div className="bg-accent absolute bottom-0 left-0 h-0.5 w-7"></div>
          </div>

          <div className="text-center md:text-start">
            <h3 className="text-accent relative mb-4 pb-2 text-lg">
              Liên kết nhanh
              <div className="bg-accent absolute bottom-0 left-0 h-0.5 w-7"></div>
            </h3>
            <ul className="list-none">
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Trang chủ
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Giới thiệu
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Tin tức & Sự kiện
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Thư viện
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Hỏi đáp
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <h3 className="text-accent relative mb-4 pb-2 text-lg">
              Đào tạo
              <div className="bg-accent absolute bottom-0 left-0 h-0.5 w-7"></div>
            </h3>
            <ul className="list-none">
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Tuyển sinh
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Chương trình đào tạo
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Đào tạo đại học
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Đào tạo sau đại học
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Đào tạo liên tục
                </a>
              </li>
              <li className="group mb-2">
                <a
                  href="#"
                  className="hover:text-accent flex items-center gap-2 text-sm text-blue-200 no-underline duration-300 group-hover:translate-x-1"
                >
                  <div className="opacity-0 duration-300 group-hover:opacity-100">
                    →
                  </div>
                  Hợp tác quốc tế
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <h3 className="text-accent relative mb-4 pb-2 text-lg">
              Thông tin liên hệ
              <div className="bg-accent absolute bottom-0 left-0 h-0.5 w-7"></div>
            </h3>
            <ul className="list-none">
              <li className="mb-3 flex items-center gap-2 text-sm text-blue-200">
                <div className="bg-accent flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div>470 Trần Đại Nghĩa, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng</div>
              </li>
              <li className="mb-3 flex items-center gap-2 text-sm text-blue-200">
                <div className="bg-accent flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>(0236) 3667 117</div>
              </li>
              <li className="mb-3 flex items-center gap-2 text-sm text-blue-200">
                <div className="bg-accent flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                  <FontAwesomeIcon icon={faInbox} />
                </div>
                <div>info@vku.udn.vn</div>
              </li>
              <li className="mb-3 flex items-center gap-2 text-sm text-blue-200">
                <div className="bg-accent flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div>www.vku.udn.vn</div>
              </li>
            </ul>

            <div className="mt-5 flex gap-4">
              <a
                className="hover:bg-accent flex size-10 items-center justify-center rounded-full bg-black text-lg text-white no-underline opacity-20 duration-300 ease-in-out hover:-translate-y-1 hover:text-[#333] hover:opacity-100"
                href="#"
                title="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                className="hover:bg-accent flex size-10 items-center justify-center rounded-full bg-black text-lg text-white no-underline opacity-20 duration-300 ease-in-out hover:-translate-y-1 hover:text-[#333] hover:opacity-100"
                href="#"
                title="YouTube"
              >
                <FontAwesomeIcon icon={faPlay} />
              </a>
              <a
                className="hover:bg-accent flex size-10 items-center justify-center rounded-full bg-black text-lg text-white no-underline opacity-20 duration-300 ease-in-out hover:-translate-y-1 hover:text-[#333] hover:opacity-100"
                href="#"
                title="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a
                className="hover:bg-accent flex size-10 items-center justify-center rounded-full bg-black text-lg text-white no-underline opacity-20 duration-300 ease-in-out hover:-translate-y-1 hover:text-[#333] hover:opacity-100"
                href="#"
                title="Zalo"
              >
                <FontAwesomeIcon icon={faZ} />
              </a>
            </div>
          </div>
        </div>

        <div className="boder flex flex-col flex-wrap items-center justify-between gap-4 border-t pt-5 text-center lg:flex-row">
          <p className="text-sm text-blue-200">
            &copy; 2024 Trường Đại học Công nghệ Thông tin và Truyền thông Việt
            - Hàn. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex justify-center gap-5 text-wrap">
            <a
              href="#"
              className="hover:text-accent text-sm text-blue-200 no-underline duration-300 ease-in-out"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="hover:text-accent text-sm text-blue-200 no-underline duration-300 ease-in-out"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="hover:text-accent text-sm text-blue-200 no-underline duration-300 ease-in-out"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
