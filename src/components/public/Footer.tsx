import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        color: "#fff",
        padding: "60px 5% 28px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: 40,
            marginBottom: 50,
          }}
        >
          {/* BRAND */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <img
                src="/Gemini_Generated_Image_8r13mo8r13mo8r13-removebg-preview.png"
                alt="EVA Media"
                style={{
                  height: 120,
                  objectFit: "contain",
                }}
              />


            </div>

            <p
              style={{
                color: "rgba(255,255,255,.45)",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Công ty sản xuất nội dung truyền thông, quay chụp chuyên nghiệp và
              tổ chức sự kiện sân khấu.
            </p>

            {/* SOCIAL */}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {[
                { icon: <FaFacebookF />, link: "https://www.facebook.com/evamedia.vn" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaYoutube />, link: "https://www.youtube.com/@evamediavn" },
                { icon: <FaTiktok />, link: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "rgba(255,255,255,.08)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: 18,
                    color: "#fff",

                    transition: "all .25s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,.08)")
                  }
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <h4
              style={{
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Dịch Vụ
            </h4>

            {[
              "Quay Phim Sự Kiện",
              "Chụp Ảnh Chuyên Nghiệp",
              "Âm Thanh Ánh Sáng",
              "Tổ Chức Sân Khấu",
              "Sản Xuất TV Show",
            ].map((s) => (
              <Link
                key={s}
                to="/programs"
                style={{
                  display: "block",
                  color: "rgba(255,255,255,.45)",
                  textDecoration: "none",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {s}
              </Link>
            ))}
          </div>

          {/* NAVIGATION */}
          <div>
            <h4
              style={{
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Khám Phá
            </h4>

            {[{ to: "/", l: "Trang Chủ" }, { to: "/programs", l: "Chương Trình" }].map(
              (item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,.45)",
                    textDecoration: "none",
                    fontSize: 13,
                    marginBottom: 10,
                  }}
                >
                  {item.l}
                </Link>
              )
            )}
          </div>

          {/* CONTACT + MAP */}
          <div>
            <h4
              style={{
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Liên Hệ
            </h4>

            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
              📍 Ngõ 119 Phố Hồ Đắc Di 2 Phường Hồ Đắc Di, Tổ 2, Đống Đa, Hà Nội 10000, Việt Nam
            </div>

            <div style={{ fontSize: 13, marginTop: 8 }}>
              📞 0903 250684
            </div>

            <div style={{ fontSize: 13, marginTop: 8 }}>
              ✉ info@evamedia.vn
            </div>

            {/* GOOGLE MAP */}
            
            <div
              style={{
                marginTop: 16,
                borderRadius: 8,
                overflow: "hidden",
                height: 150,
              }}
            >
              <iframe
                title="EVA Media Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5076101843515!2d105.82603437612852!3d21.012365888339666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7f8214294d%3A0x86cb4b9633d9639!2zTmcuIDExOSBQLiBI4buTIMSQ4bqvYyBEaS8yIFAuIEjhu5MgxJDhuq9jIERpLCBU4buVIDIsIMSQ4buRbmcgxJBhLCBIw6AgTuG7mWkgMTAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1773692762064!5m2!1svi!2s"
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>
            © 2025 EVA Media. All rights reserved.
          </p>

          <p style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>
            Made with EVA Media in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}