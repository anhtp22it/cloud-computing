import { faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faInbox,
  faLocationDot,
  faPhone,
  faPlay,
  faZ,
  faArrowUp,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

const FooterUser = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-blue-400 blur-xl"></div>
        <div className="absolute top-32 right-20 h-16 w-16 animate-pulse rounded-full bg-purple-400 blur-xl delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 h-24 w-24 animate-pulse rounded-full bg-cyan-400 blur-xl delay-2000"></div>
        <div className="absolute right-1/3 bottom-32 h-12 w-12 animate-pulse rounded-full bg-pink-400 blur-xl delay-3000"></div>
      </div>

      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-yellow-400 via-green-500 via-red-500 to-blue-500">
        <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="group">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  <img
                    src="/mini-logo.png"
                    alt="VKU Logo"
                    className="h-16 w-16 rounded-xl bg-white/10 p-2 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-50"></div>
                </div>
                <div className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-2xl font-bold text-transparent">
                  VKU
                </div>
              </div>

              <p className="text-sm leading-relaxed text-blue-100/80">
                Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực CNTT, hướng
                tới sự phát triển bền vững và hội nhập quốc tế.
              </p>

              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="relative text-xl font-semibold text-blue-200">
              Liên kết nhanh
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </h3>

            <nav className="space-y-3">
              {[
                "Trang chủ",
                "Giới thiệu",
                "Tin tức & Sự kiện",
                "Thư viện",
                "Hỏi đáp",
                "Liên hệ",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center gap-3 text-blue-100/70 transition-all duration-300 hover:translate-x-2 hover:text-blue-200"
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="h-3 w-3 text-blue-400 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  />
                  <span className="relative">
                    {item}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Training section */}
          <div className="space-y-6">
            <h3 className="relative text-xl font-semibold text-blue-200">
              Đào tạo
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </h3>

            <nav className="space-y-3">
              {[
                "Tuyển sinh",
                "Chương trình đào tạo",
                "Đào tạo đại học",
                "Đào tạo sau đại học",
                "Đào tạo liên tục",
                "Hợp tác quốc tế",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center gap-3 text-blue-100/70 transition-all duration-300 hover:translate-x-2 hover:text-blue-200"
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="h-3 w-3 text-blue-400 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  />
                  <span className="relative">
                    {item}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="relative text-xl font-semibold text-blue-200">
              Thông tin liên hệ
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: faLocationDot,
                  text: "470 Trần Đại Nghĩa, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng",
                  color: "from-red-400 to-pink-400",
                },
                {
                  icon: faPhone,
                  text: "(0236) 3667 117",
                  color: "from-green-400 to-emerald-400",
                },
                {
                  icon: faInbox,
                  text: "info@vku.udn.vn",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  icon: faGlobe,
                  text: "www.vku.udn.vn",
                  color: "from-purple-400 to-indigo-400",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 text-blue-100/80"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${contact.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <FontAwesomeIcon
                      icon={contact.icon}
                      className="h-4 w-4 text-white"
                    />
                  </div>
                  <span className="text-sm leading-relaxed transition-colors duration-300 group-hover:text-blue-100">
                    {contact.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="mb-4 font-medium text-blue-200">
                Kết nối với chúng tôi
              </p>
              <div className="flex gap-3">
                {[
                  {
                    icon: faFacebookF,
                    color: "from-blue-500 to-blue-600",
                    name: "Facebook",
                  },
                  {
                    icon: faPlay,
                    color: "from-red-500 to-red-600",
                    name: "YouTube",
                  },
                  {
                    icon: faLinkedinIn,
                    color: "from-blue-600 to-blue-700",
                    name: "LinkedIn",
                  },
                  {
                    icon: faZ,
                    color: "from-cyan-500 to-cyan-600",
                    name: "Zalo",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    title={social.name}
                    className={`group relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${social.color} shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl`}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className="h-5 w-5 text-white"
                    />
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p className="text-center text-sm text-blue-100/70">
              &copy; 2024 Trường Đại học Công nghệ Thông tin và Truyền thông
              Việt - Hàn.
              <span className="block lg:inline">
                {" "}
                Tất cả quyền được bảo lưu.
              </span>
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {["Chính sách bảo mật", "Điều khoản sử dụng", "Sitemap"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="relative text-sm text-blue-100/70 transition-all duration-300 hover:text-blue-200"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 hover:w-full"></span>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5 text-white" />
        </button>
      )}
    </footer>
  );
};

export default FooterUser;
