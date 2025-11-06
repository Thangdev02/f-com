"use client"

import { motion } from "framer-motion"

export default function Intro() {
  return (
    <div className="font-sans text-gray-800">

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
  {/* Background image */}
  <div className="absolute inset-0">
    <img
      src="https://international.fpt.edu.vn/web/image/image.gallery/1499/image" // Thay bằng hình nền bạn muốn
      alt="Hero Background"
      className="w-full h-full object-cover"
    />
    {/* Overlay đen */}
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

  {/* Content */}
  <motion.h1 
    initial={{ opacity: 0, y: -50 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8 }}
    className="text-4xl md:text-6xl font-bold mb-4 text-white relative z-10"
  >
    Chào mừng đến F-Community
  </motion.h1>
  <motion.p 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 1.2 }}
    className="text-lg md:text-2xl max-w-xl mb-8 text-white relative z-10"
  >
    Một nền tảng hiện đại giúp kết nối cộng đồng, chia sẻ ý tưởng và tương tác trực tiếp.
  </motion.p>
  <motion.a
    href="#features"
    whileHover={{ scale: 1.05 }}
    className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors relative z-10"
  >
    Tìm hiểu ngay
  </motion.a>
</section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Khám phá những gì nền tảng của chúng tôi có thể làm cho bạn</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Tương tác trực tiếp</h3>
            <p className="text-gray-500">Gửi bình luận, thả like và kết nối với cộng đồng một cách nhanh chóng.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Quản lý bài viết</h3>
            <p className="text-gray-500">Tạo, chỉnh sửa, xóa và chia sẻ bài đăng dễ dàng với giao diện trực quan.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Phản hồi nhanh chóng</h3>
            <p className="text-gray-500">Hệ thống thông báo giúp bạn nắm bắt mọi tương tác ngay lập tức.</p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.img 
          src="https://fpt.com/Resources/2011/03/14/8749878/fpt_6.jpg" 
          alt="About project" 
          className="rounded-xl shadow-lg w-full md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4">Về dự án</h2>
          <p className="text-gray-600 mb-4">
            F-Community được tạo ra nhằm giúp học sinh, sinh viên, giảng viên và cộng đồng dễ dàng chia sẻ ý tưởng, thảo luận và học hỏi lẫn nhau.
          </p>
          <p className="text-gray-600">
            Chúng tôi mong muốn xây dựng một nền tảng thân thiện, trực quan và hiện đại, nơi mọi người đều có thể tham gia và phát triển kỹ năng của mình.
          </p>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-100 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hình ảnh dự án</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Một số hình ảnh minh họa về giao diện và tính năng nổi bật.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <img style={{ width: "100%", height: "300px", objectFit: "cover" }} src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/07/phong-hoc-tieng-anh-dh-fpt.jpeg" alt="Gallery 1" className="rounded-lg shadow-lg" />
          <img  style={{ width: "100%", height: "300px",objectFit: "cover" }} src="https://daihoc.fpt.edu.vn/wp-content/uploads/2022/04/thang-ren-luyen-tap-trung-dai-hoc-fpt-7-910x512.jpeg" alt="Gallery 2" className="rounded-lg shadow-lg" />
          <img  style={{ width: "100%", height: "300px",objectFit: "cover" }} src="https://daihoc.fpt.edu.vn/wp-content/uploads/2016/12/13015326_1006583956086631_1734788458934006276_n.jpg" alt="Gallery 3" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tham gia ngay</h2>
        <p className="mb-8 max-w-xl mx-auto">Trở thành một phần của cộng đồng, chia sẻ ý tưởng và kết nối với những người cùng đam mê.</p>
        <a href="/login" className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors">
          Đăng ký ngay
        </a>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2025 F-Community. All rights reserved.</p>
      </footer>

    </div>
  )
}
