const moneyImage =
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=80";
const calculatorImage =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80";
const goldImage =
  "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1400&q=80";
const cryptoImage =
  "https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=1400&q=80";
const oilImage =
  "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1400&q=80";
const travelImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80";

const defaultTools = [
  {
    href: "/usd-vnd",
    label: "Công cụ USD/VND",
    description: "Quy đổi USD sang VND và xem các mốc tiền phổ biến.",
  },
  {
    href: "/gia-vang-hom-nay",
    label: "Giá vàng hôm nay",
    description: "Xem giá vàng thế giới, SJC, PNJ, DOJI và quy đổi chỉ/lượng.",
  },
  {
    href: "/phuong-phap-du-lieu",
    label: "Phương pháp dữ liệu",
    description: "Kiểm tra nguồn dữ liệu, cache và fallback của hệ thống.",
  },
];

export const blogPosts = [
  {
    slug: "ty-gia-tham-khao-va-tien-thuc-nhan",
    title: "Tỷ giá tham khảo và số tiền thực nhận khác nhau thế nào?",
    description:
      "Hiểu vì sao kết quả quy đổi trên công cụ có thể khác số tiền nhận tại ngân hàng, tiệm vàng hoặc dịch vụ chuyển tiền.",
    category: "Tỷ giá",
    intent: "Người dùng chuẩn bị đổi tiền hoặc chuyển tiền",
    updatedAt: "2026-05-24",
    readingTime: "7 phút",
    image: moneyImage,
    imageAlt: "Tiền USD dùng để minh họa tỷ giá tham khảo",
    intro:
      "Khi tra 50 USD, 100 USD hoặc một khoản tiền lớn hơn sang VND, công cụ quy đổi cho bạn câu trả lời rất nhanh. Nhưng trong giao dịch thật, số tiền cuối cùng thường bị ảnh hưởng bởi giá mua, giá bán, phí và thời điểm chốt lệnh.",
    takeaways: [
      "Tỷ giá tham khảo phù hợp để ước tính nhanh, so sánh và lập kế hoạch.",
      "Số tiền thực nhận phụ thuộc vào nơi giao dịch, loại giao dịch và phí đi kèm.",
      "Trước khi chuyển tiền lớn, nên kiểm tra lại giá cuối cùng tại đơn vị bạn dùng.",
    ],
    sections: [
      {
        heading: "Tỷ giá tham khảo là gì?",
        body: [
          "Tỷ giá tham khảo là mức quy đổi lấy từ nguồn dữ liệu thị trường, ngân hàng, sàn giao dịch hoặc API tổng hợp. Mục đích chính là giúp bạn ước tính giá trị giữa hai đồng tiền trong vài giây.",
          "Mức này không phải lúc nào cũng là giá giao dịch cuối cùng. Cùng là USD/VND nhưng tỷ giá tham khảo, giá ngân hàng, giá tiệm vàng và giá P2P có thể lệch nhau vì mỗi nơi phản ánh một nhu cầu khác nhau.",
        ],
      },
      {
        heading: "Vì sao số tiền thực nhận có thể thấp hơn?",
        body: [
          "Khi bạn bán ngoại tệ, đơn vị giao dịch thường áp dụng giá mua vào. Khi bạn mua ngoại tệ, họ áp dụng giá bán ra. Khoảng cách giữa hai mức này gọi là spread và đây là một phần chi phí giao dịch.",
          "Ngoài spread, bạn còn có thể gặp phí chuyển khoản, phí rút tiền, phí xử lý quốc tế, giới hạn giao dịch hoặc tỷ giá được chốt muộn hơn thời điểm bạn tra cứu.",
        ],
      },
      {
        heading: "Cách dùng công cụ quy đổi thông minh hơn",
        body: [
          "Hãy xem kết quả quy đổi như một mức ước tính nhanh. Với số tiền nhỏ, sai lệch vài nghìn đến vài chục nghìn đồng có thể không đáng kể. Với số tiền lớn, chênh lệch vài chục đồng trên mỗi USD đã tạo ra khác biệt rõ ràng.",
          "Thói quen tốt là tra nhanh trên công cụ, so sánh thêm nguồn giao dịch thực tế, rồi mới quyết định chốt. Cách này giúp bạn tránh nhầm giữa con số tham khảo đẹp mắt và số tiền thật đi vào tài khoản.",
        ],
      },
    ],
    tools: [
      defaultTools[0],
      {
        href: "/100-usd-vnd",
        label: "100 USD sang VND",
        description: "Trang trả lời nhanh cho nhu cầu tra cứu phổ biến.",
      },
      {
        href: "/50-usd-vnd",
        label: "50 USD sang VND",
        description: "Ước tính nhanh khoản USD nhỏ trước khi giao dịch.",
      },
    ],
  },
  {
    slug: "vi-sao-ty-gia-usd-vnd-moi-noi-moi-khac",
    title: "Vì sao tỷ giá USD/VND mỗi nơi một khác?",
    description:
      "Các nguyên nhân khiến tỷ giá USD/VND ở ngân hàng, thị trường tham khảo, tiệm vàng và P2P không giống nhau.",
    category: "USD/VND",
    intent: "So sánh ngân hàng, API, tiệm vàng và P2P",
    updatedAt: "2026-05-24",
    readingTime: "8 phút",
    image: calculatorImage,
    imageAlt: "Bàn làm việc tài chính với máy tính và giấy tờ",
    intro:
      "Bạn có thể thấy cùng một ngày nhưng tỷ giá USD/VND ở nhiều nơi chênh lệch rõ ràng. Điều đó không nhất thiết là dữ liệu sai; thường là vì mỗi nguồn đang phục vụ một kiểu giao dịch khác nhau.",
    takeaways: [
      "Ngân hàng luôn có giá mua vào và bán ra riêng.",
      "API thị trường thường tốt cho tham khảo, không phải cam kết giao dịch.",
      "P2P và USDT có thể hấp dẫn về tỷ giá nhưng đi kèm rủi ro khác.",
    ],
    sections: [
      {
        heading: "Ngân hàng niêm yết hai chiều giá",
        body: [
          "Ngân hàng thường công bố giá mua vào và giá bán ra. Nếu bạn bán USD cho ngân hàng, bạn nhận theo giá mua vào. Nếu bạn mua USD, bạn trả theo giá bán ra.",
          "Khoảng cách giữa hai chiều giá giúp ngân hàng bù chi phí vận hành, rủi ro tỷ giá và biên lợi nhuận. Vì vậy bạn không nên lấy một con số USD/VND bất kỳ rồi mặc định đó là giá có thể giao dịch ngay.",
        ],
      },
      {
        heading: "Nguồn API và thị trường phản ánh mục đích khác nhau",
        body: [
          "Một số API dùng tỷ giá trung bình thị trường quốc tế. Một số nguồn lại lấy dữ liệu ngân hàng, sàn crypto hoặc nhà cung cấp thanh toán. Vì vậy cùng một cặp USD/VND nhưng bối cảnh dữ liệu khác nhau sẽ cho kết quả khác nhau.",
          "Với người dùng phổ thông, cách dễ hiểu nhất là dùng API để nắm hướng tỷ giá, rồi kiểm tra nguồn giao dịch thật khi chuẩn bị chuyển tiền, đổi tiền hoặc thanh toán.",
        ],
      },
      {
        heading: "Không nên chỉ nhìn nơi có tỷ giá cao nhất",
        body: [
          "Một mức tỷ giá cao hơn có thể đi kèm phí cao hơn, thời gian xử lý lâu hơn hoặc rủi ro đối tác. Đặc biệt với giao dịch P2P, bạn cần chú ý thanh khoản, điều kiện xác minh, quy định nền tảng và dấu hiệu lừa đảo.",
          "Khi so sánh, hãy tính cả tỷ giá, phí, tốc độ, độ tin cậy và khả năng khiếu nại nếu có vấn đề. Con số tốt nhất trên màn hình chưa chắc là lựa chọn tốt nhất sau khi trừ toàn bộ chi phí.",
        ],
      },
    ],
    tools: [
      defaultTools[0],
      {
        href: "/usdt-vnd",
        label: "So sánh USDT/VND",
        description: "Xem thêm tỷ giá stablecoin nếu bạn dùng crypto.",
      },
      defaultTools[2],
    ],
  },
  {
    slug: "cach-tinh-1-chi-1-luong-vang",
    title: "Cách tính 1 chỉ, 1 lượng vàng và quy đổi sang tiền",
    description:
      "Giải thích đơn vị vàng Việt Nam: chỉ, lượng, cây; cách tính giá 1 chỉ vàng và khi nào nên dùng giá mua vào hoặc bán ra.",
    category: "Vàng",
    intent: "Tra cứu đơn vị vàng và giá vàng trong nước",
    updatedAt: "2026-05-24",
    readingTime: "7 phút",
    image: goldImage,
    imageAlt: "Các thỏi vàng xếp chồng minh họa giá vàng",
    intro:
      "Ở Việt Nam, giá vàng thường được niêm yết theo lượng hoặc cây, trong khi nhiều người lại cần biết 1 chỉ vàng bằng bao nhiêu tiền. Chỉ cần nắm đúng đơn vị và chiều giá, bạn sẽ tránh được rất nhiều nhầm lẫn.",
    takeaways: [
      "1 lượng vàng bằng 10 chỉ và tương đương 37,5 gram.",
      "Giá 1 chỉ thường bằng giá 1 lượng chia 10.",
      "Mua vàng xem giá bán ra, bán vàng xem giá mua vào.",
    ],
    sections: [
      {
        heading: "1 lượng vàng bằng bao nhiêu chỉ?",
        body: [
          "Theo cách dùng phổ biến tại Việt Nam, 1 lượng vàng còn gọi là 1 cây vàng và bằng 10 chỉ. Về khối lượng, 1 lượng tương đương 37,5 gram, còn 1 chỉ tương đương 3,75 gram.",
          "Vì vậy nếu bảng giá niêm yết theo lượng, bạn có thể tính nhanh giá 1 chỉ bằng cách chia cho 10. Đây là công thức đơn giản nhưng rất hữu ích khi so sánh nhẫn, vàng miếng hoặc các sản phẩm nhỏ hơn.",
        ],
      },
      {
        heading: "Cách tính giá 1 chỉ vàng",
        body: [
          "Công thức cơ bản là: giá 1 chỉ = giá 1 lượng / 10. Ví dụ nếu giá bán ra là 160.000.000 VND/lượng, thì 1 chỉ theo giá bán ra khoảng 16.000.000 VND.",
          "Tuy nhiên, một số sản phẩm vàng trang sức có thêm tiền công, phí chế tác hoặc chênh lệch thương hiệu. Vì vậy giá cuối cùng tại cửa hàng có thể khác con số chia đơn giản từ bảng giá vàng miếng.",
        ],
      },
      {
        heading: "Nên dùng giá mua vào hay bán ra?",
        body: [
          "Nếu bạn đang muốn mua vàng, hãy quan tâm đến giá bán ra vì đó là mức cửa hàng bán cho bạn. Nếu bạn đang muốn bán vàng, hãy xem giá mua vào vì đó là mức cửa hàng mua lại từ bạn.",
          "Khoảng cách giữa mua vào và bán ra là chi phí quan trọng. Với vàng, spread có thể thay đổi mạnh theo thương hiệu, loại vàng, thời điểm thị trường và chính sách từng đơn vị.",
        ],
      },
    ],
    tools: [
      {
        href: "/1-chi-vang-bao-nhieu-tien",
        label: "Tính 1 chỉ vàng",
        description: "Tự động lấy giá vàng trong hệ thống và quy đổi ra VND.",
      },
      {
        href: "/1-luong-vang-bao-nhieu-usd",
        label: "1 lượng vàng sang USD",
        description: "Ước tính giá trị vàng Việt Nam theo USD.",
      },
      defaultTools[1],
    ],
  },
  {
    slug: "gia-vang-sjc-pnj-doji-khac-nhau-the-nao",
    title: "Giá vàng SJC, PNJ, DOJI khác nhau thế nào?",
    description:
      "Cách đọc bảng giá vàng theo thương hiệu, vì sao mua vào/bán ra khác nhau và khi nào nên so sánh vàng miếng với vàng nhẫn.",
    category: "Vàng",
    intent: "So sánh thương hiệu vàng Việt Nam",
    updatedAt: "2026-05-24",
    readingTime: "8 phút",
    image: goldImage,
    imageAlt: "Vàng miếng dùng để minh họa so sánh thương hiệu vàng",
    intro:
      "Khi tìm giá vàng hôm nay, người dùng thường thấy SJC, PNJ, DOJI, Bảo Tín Minh Châu hoặc Phú Quý có mức mua vào và bán ra khác nhau. Nếu không hiểu loại vàng và chiều giao dịch, bạn rất dễ so sánh sai.",
    takeaways: [
      "Luôn so sánh cùng loại: vàng miếng với vàng miếng, vàng nhẫn với vàng nhẫn.",
      "Giá bán ra là chi phí khi mua, giá mua vào là số tiền nhận khi bán.",
      "Thương hiệu, khu vực và chính sách từng hệ thống có thể tạo chênh lệch.",
    ],
    sections: [
      {
        heading: "Không phải mọi dòng vàng đều giống nhau",
        body: [
          "Vàng miếng SJC, vàng nhẫn 9999, vàng 24K và vàng trang sức có cách định giá khác nhau. Vàng miếng thường được quan tâm như tài sản tích trữ, còn vàng trang sức có thêm tiền công và phí chế tác.",
          "Vì vậy khi xem bảng giá, hãy kiểm tra cột loại vàng trước khi nhìn con số. So sánh vàng miếng của thương hiệu này với vàng nhẫn của thương hiệu khác thường dẫn đến kết luận sai.",
        ],
      },
      {
        heading: "Mua vào và bán ra nói lên điều gì?",
        body: [
          "Giá mua vào là mức doanh nghiệp mua lại từ bạn. Giá bán ra là mức doanh nghiệp bán cho bạn. Khoảng cách giữa hai mức này chính là spread, tác động trực tiếp đến điểm hòa vốn nếu bạn mua rồi bán lại.",
          "Người mua để tích trữ nên chú ý cả giá bán ra lẫn spread. Một nơi bán thấp nhưng mua lại cũng thấp có thể chưa chắc tốt hơn một nơi có spread ổn định và thanh khoản tốt.",
        ],
      },
      {
        heading: "Cách dùng bảng giá trên ChuyenDoiTien",
        body: [
          "Trang giá vàng của ChuyenDoiTien ưu tiên nguồn live cho vàng Việt Nam, sau đó mới dùng fallback. Điều này giúp bảng giá bám sát thị trường hơn thay vì phụ thuộc hoàn toàn vào file thủ công.",
          "Khi cần giao dịch thật, hãy dùng bảng giá để lọc nhanh thương hiệu và chiều giá, rồi xác nhận lại với cửa hàng hoặc website chính thức của đơn vị bán vàng.",
        ],
      },
    ],
    tools: [defaultTools[1], defaultTools[2]],
  },
  {
    slug: "1-luong-vang-bao-nhieu-usd-cach-tinh",
    title: "1 lượng vàng bao nhiêu USD? Cách tính từ giá vàng Việt Nam",
    description:
      "Cách quy đổi giá 1 lượng vàng Việt Nam sang USD bằng giá mua/bán trong nước và tỷ giá USD/VND.",
    category: "Vàng",
    intent: "Quy đổi vàng Việt Nam sang USD",
    updatedAt: "2026-05-24",
    readingTime: "6 phút",
    image: goldImage,
    imageAlt: "Thỏi vàng và tiền USD minh họa quy đổi vàng sang USD",
    intro:
      "Người dùng ở Việt Nam thường tra giá vàng theo lượng, nhưng khi so sánh với quốc tế lại cần đổi sang USD. Công thức không khó, nhưng phải dùng đúng giá mua vào hoặc bán ra tùy mục đích.",
    takeaways: [
      "1 lượng vàng Việt Nam bằng 37,5 gram, lớn hơn 1 troy ounce.",
      "Giá USD của 1 lượng vàng = giá VND/lượng chia tỷ giá USD/VND.",
      "Mua vàng dùng giá bán ra, bán vàng dùng giá mua vào.",
    ],
    sections: [
      {
        heading: "Công thức quy đổi 1 lượng vàng sang USD",
        body: [
          "Nếu giá vàng là 161.500.000 VND/lượng và USD/VND là 26.180, giá trị quy đổi xấp xỉ 161.500.000 / 26.180 = 6.169 USD/lượng.",
          "Con số này là quy đổi theo tỷ giá tham khảo. Trong giao dịch thật, ngân hàng hoặc dịch vụ chuyển tiền có thể áp dụng tỷ giá và phí khác.",
        ],
      },
      {
        heading: "Vì sao không nên dùng trực tiếp XAU/USD?",
        body: [
          "XAU/USD là giá quốc tế cho 1 troy ounce, tương đương khoảng 31,1035 gram. Trong khi đó, 1 lượng vàng Việt Nam là 37,5 gram.",
          "Ngoài khác biệt đơn vị, giá vàng trong nước còn chịu ảnh hưởng bởi thương hiệu, cung cầu và chênh lệch mua bán. Vì vậy muốn biết 1 lượng vàng Việt Nam bao nhiêu USD, nên lấy giá trong nước chia USD/VND.",
        ],
      },
    ],
    tools: [
      {
        href: "/1-luong-vang-bao-nhieu-usd",
        label: "Tính 1 lượng vàng sang USD",
        description: "Công cụ tự lấy giá vàng và tỷ giá để quy đổi.",
      },
      defaultTools[1],
    ],
  },
  {
    slug: "100-usd-bang-bao-nhieu-tien-viet",
    title: "100 USD bằng bao nhiêu tiền Việt? Cách đọc kết quả đúng",
    description:
      "Giải thích nhanh cách quy đổi 100 USD sang VND, vì sao kết quả có thể khác ngân hàng và khi nào nên kiểm tra phí.",
    category: "USD/VND",
    intent: "Trả lời truy vấn số tiền cụ thể",
    updatedAt: "2026-05-24",
    readingTime: "5 phút",
    image: moneyImage,
    imageAlt: "Tiền USD minh họa quy đổi 100 USD sang tiền Việt",
    intro:
      "100 USD sang VND là một truy vấn rất phổ biến vì đủ nhỏ để đi du lịch, mua hàng hoặc nhận tiền quốc tế. Tuy nhiên, con số quy đổi trên web và số tiền thực nhận có thể khác nhau.",
    takeaways: [
      "100 USD x USD/VND cho kết quả tham khảo tức thời.",
      "Ngân hàng, ví điện tử và dịch vụ chuyển tiền có thể áp dụng phí riêng.",
      "Nếu dùng tiền mặt, cần chú ý tình trạng tờ tiền và nơi đổi.",
    ],
    sections: [
      {
        heading: "Cách tính 100 USD sang VND",
        body: [
          "Công thức là 100 x tỷ giá USD/VND. Nếu tỷ giá là 26.180 VND/USD, 100 USD tương đương khoảng 2.618.000 VND.",
          "Công cụ quy đổi giúp bạn có kết quả nhanh, đặc biệt khi cần so sánh nhiều mốc như 50 USD, 100 USD, 500 USD hoặc 1.000 USD.",
        ],
      },
      {
        heading: "Khi nào kết quả thực tế bị lệch?",
        body: [
          "Nếu bạn nhận tiền qua dịch vụ quốc tế, phí chuyển tiền và tỷ giá của nhà cung cấp có thể làm số tiền thấp hơn. Nếu đổi tiền mặt, giá mua vào và điều kiện tờ tiền cũng ảnh hưởng.",
          "Với khoản tiền lớn, nên kiểm tra trước bảng phí và tỷ giá cuối cùng của nơi giao dịch thay vì chỉ nhìn tỷ giá tham khảo.",
        ],
      },
    ],
    tools: [
      {
        href: "/100-usd-vnd",
        label: "100 USD sang VND",
        description: "Xem số tiền quy đổi tự động theo tỷ giá hiện tại.",
      },
      defaultTools[0],
    ],
  },
  {
    slug: "usdt-va-usd-khac-nhau-khi-quy-doi-vnd",
    title: "USDT và USD khác nhau thế nào khi quy đổi sang VND?",
    description:
      "So sánh USD tiền pháp định và USDT khi quy đổi sang VND, gồm tỷ giá, thanh khoản, phí và rủi ro.",
    category: "Crypto",
    intent: "Người dùng crypto muốn đổi sang VND",
    updatedAt: "2026-05-24",
    readingTime: "7 phút",
    image: cryptoImage,
    imageAlt: "Biểu tượng tiền mã hóa và dữ liệu giao dịch",
    intro:
      "USDT thường được xem như stablecoin neo gần 1 USD, nhưng khi quy đổi sang VND thì trải nghiệm không giống hoàn toàn với USD tiền pháp định. Khác biệt nằm ở bản chất tài sản, nơi giao dịch và rủi ro vận hành.",
    takeaways: [
      "USD là tiền pháp định, USDT là token stablecoin.",
      "USDT/VND có thể lệch USD/VND vì cung cầu và phí nền tảng.",
      "Cần tính cả phí, tốc độ, rủi ro tài khoản và tuân thủ pháp lý.",
    ],
    sections: [
      {
        heading: "USD là tiền pháp định, USDT là token",
        body: [
          "USD là đồng tiền pháp định của Hoa Kỳ. USDT là stablecoin do doanh nghiệp phát hành, vận hành trên nhiều blockchain và thường được thiết kế để neo quanh 1 USD.",
          "Khi bạn nắm USDT, bạn phụ thuộc thêm vào ví, mạng blockchain, sàn giao dịch, thanh khoản và đơn vị phát hành. Đây là khác biệt quan trọng so với việc nắm giữ USD truyền thống.",
        ],
      },
      {
        heading: "Vì sao USDT/VND có thể khác USD/VND?",
        body: [
          "Tỷ giá USDT/VND trên thị trường P2P chịu ảnh hưởng bởi cung cầu crypto, phí sàn, phương thức thanh toán, tốc độ xử lý và rủi ro đối tác.",
          "Khi thị trường biến động mạnh, chênh lệch có thể mở rộng. Người mua cần USDT nhanh có thể trả giá cao hơn, còn người bán muốn thoát vị thế nhanh có thể chấp nhận giá thấp hơn.",
        ],
      },
    ],
    tools: [
      {
        href: "/usdt-vnd",
        label: "Xem tỷ giá USDT/VND",
        description: "Tra cứu nhanh USDT sang VND trong công cụ crypto.",
      },
      defaultTools[0],
    ],
  },
  {
    slug: "doi-tien-di-du-lich-nen-xem-ty-gia-nao",
    title: "Đổi tiền đi du lịch nên xem tỷ giá nào?",
    description:
      "Checklist chọn tỷ giá khi đổi tiền trước chuyến đi: tiền mặt, thẻ, phí chuyển đổi ngoại tệ và cách ước tính ngân sách.",
    category: "Du lịch",
    intent: "Người dùng đổi ngoại tệ cho chuyến đi",
    updatedAt: "2026-05-24",
    readingTime: "7 phút",
    image: travelImage,
    imageAlt: "Hành lý du lịch và bản đồ minh họa đổi tiền trước chuyến đi",
    intro:
      "Khi đi du lịch, tỷ giá không chỉ là một con số trên Google. Bạn cần biết mình sẽ dùng tiền mặt, thẻ quốc tế hay ví điện tử, vì mỗi cách thanh toán có chi phí khác nhau.",
    takeaways: [
      "Tra tỷ giá tham khảo trước để lập ngân sách.",
      "Kiểm tra phí chuyển đổi ngoại tệ của thẻ hoặc ví thanh toán.",
      "Không nên đổi toàn bộ tiền mặt nếu không cần thiết.",
    ],
    sections: [
      {
        heading: "Tỷ giá nào phù hợp để lập ngân sách?",
        body: [
          "Khi lên kế hoạch, bạn có thể dùng tỷ giá tham khảo để ước tính chi phí khách sạn, ăn uống, di chuyển và mua sắm. Đây là bước đủ tốt để biết tổng ngân sách khoảng bao nhiêu VND.",
          "Tuy nhiên khi thanh toán thật, thẻ có thể dùng tỷ giá của tổ chức thẻ cộng thêm phí chuyển đổi ngoại tệ. Vì vậy ngân sách nên có biên dự phòng thay vì tính sát từng đồng.",
        ],
      },
      {
        heading: "Tiền mặt, thẻ hay ví điện tử?",
        body: [
          "Tiền mặt tiện cho khoản nhỏ nhưng có rủi ro mất mát. Thẻ tiện cho khách sạn và mua sắm lớn nhưng cần xem phí. Ví điện tử quốc tế có thể tiện nhưng phụ thuộc quốc gia bạn đến.",
          "Một cách cân bằng là đổi một phần tiền mặt cho chi phí ban đầu, phần còn lại dùng thẻ hoặc phương thức thanh toán có sao kê rõ ràng.",
        ],
      },
    ],
    tools: [defaultTools[0]],
  },
  {
    slug: "gia-dau-the-gioi-anh-huong-gia-xang-viet-nam-the-nao",
    title: "Giá dầu thế giới ảnh hưởng giá xăng Việt Nam thế nào?",
    description:
      "Vì sao Brent, WTI và giá xăng bán lẻ trong nước không tăng giảm cùng lúc, và cách đọc dữ liệu dầu cho đúng.",
    category: "Dầu",
    intent: "Hiểu liên hệ dầu quốc tế và xăng Việt Nam",
    updatedAt: "2026-05-24",
    readingTime: "8 phút",
    image: oilImage,
    imageAlt: "Nhà máy dầu và năng lượng minh họa giá dầu thế giới",
    intro:
      "Nhiều người thấy giá dầu thế giới giảm nhưng giá xăng trong nước chưa giảm ngay, rồi nghĩ dữ liệu bị sai. Thực tế, giá dầu quốc tế chỉ là một phần trong công thức giá xăng Việt Nam.",
    takeaways: [
      "Brent và WTI là giá dầu thô quốc tế, không phải giá xăng bán lẻ.",
      "Giá xăng Việt Nam còn chịu thuế, phí, chi phí phân phối và kỳ điều hành.",
      "Nên xem xu hướng nhiều ngày thay vì một phiên biến động.",
    ],
    sections: [
      {
        heading: "Brent và WTI khác gì giá xăng?",
        body: [
          "Brent và WTI là giá dầu thô, thường tính theo USD/thùng. Xăng bán lẻ là sản phẩm sau lọc dầu, vận chuyển, phân phối và chịu nhiều loại thuế phí.",
          "Vì vậy không thể lấy giá dầu thô chia trực tiếp ra giá xăng tại cây xăng. Mối quan hệ có tồn tại, nhưng có độ trễ và nhiều biến số trung gian.",
        ],
      },
      {
        heading: "Vì sao giá trong nước có độ trễ?",
        body: [
          "Giá xăng Việt Nam được điều hành theo kỳ. Trong thời gian giữa các kỳ, giá dầu thế giới có thể biến động nhiều nhưng giá bán lẻ chưa phản ánh ngay.",
          "Ngoài ra tỷ giá USD/VND cũng ảnh hưởng vì dầu quốc tế được định giá bằng USD. Khi USD tăng, chi phí nhập khẩu có thể tăng ngay cả khi giá dầu không tăng nhiều.",
        ],
      },
    ],
    tools: [
      {
        href: "/gia-dau-the-gioi-hom-nay",
        label: "Giá dầu thế giới hôm nay",
        description: "Xem Brent, WTI và quy đổi thùng/lít/gallon.",
      },
    ],
  },
  {
    slug: "cach-doc-bieu-do-ty-gia-cho-nguoi-moi",
    title: "Cách đọc biểu đồ tỷ giá cho người mới",
    description:
      "Hướng dẫn đọc xu hướng tỷ giá, đỉnh đáy, khung thời gian và những lỗi thường gặp khi nhìn biểu đồ ngắn hạn.",
    category: "Tỷ giá",
    intent: "Học cách đọc biểu đồ tài chính cơ bản",
    updatedAt: "2026-05-24",
    readingTime: "7 phút",
    image: calculatorImage,
    imageAlt: "Biểu đồ tài chính minh họa cách đọc xu hướng tỷ giá",
    intro:
      "Biểu đồ tỷ giá giúp bạn thấy xu hướng thay vì chỉ nhìn một con số tại thời điểm hiện tại. Nhưng nếu đọc sai khung thời gian hoặc bỏ qua bối cảnh, biểu đồ rất dễ gây hiểu nhầm.",
    takeaways: [
      "Khung 7 ngày phù hợp xem biến động ngắn, 30-90 ngày phù hợp xem xu hướng.",
      "Không nên kết luận từ một điểm giá đơn lẻ.",
      "Cần xem cả tin tức, lãi suất, USD Index và thanh khoản thị trường.",
    ],
    sections: [
      {
        heading: "Bắt đầu từ khung thời gian",
        body: [
          "Khung 7 ngày cho bạn thấy biến động rất gần, phù hợp khi chuẩn bị giao dịch nhỏ. Khung 30 ngày hoặc 90 ngày giúp nhìn xu hướng ổn định hơn.",
          "Nếu chỉ nhìn một ngày, bạn dễ phản ứng quá mức với biến động tạm thời. Với tỷ giá, điều quan trọng thường là xu hướng và vùng giá, không phải một điểm chính xác tuyệt đối.",
        ],
      },
      {
        heading: "Đừng bỏ qua spread và phí",
        body: [
          "Biểu đồ thường hiển thị tỷ giá tham khảo hoặc tỷ giá trung bình. Khi giao dịch thật, bạn vẫn gặp giá mua vào, bán ra và phí dịch vụ.",
          "Vì vậy biểu đồ giúp ra quyết định thời điểm tương đối, còn số tiền cuối cùng cần kiểm tra tại nơi giao dịch.",
        ],
      },
    ],
    tools: [defaultTools[0], defaultTools[2]],
  },
  {
    slug: "kiem-tra-nguon-du-lieu-gia-truoc-khi-giao-dich",
    title: "Cách kiểm tra nguồn dữ liệu giá trước khi giao dịch",
    description:
      "Checklist giúp bạn đánh giá một website giá tiền tệ, vàng, crypto hoặc dầu có đáng tin hay không.",
    category: "Dữ liệu",
    intent: "Xây dựng niềm tin và E-E-A-T cho người đọc",
    updatedAt: "2026-05-24",
    readingTime: "8 phút",
    image: calculatorImage,
    imageAlt: "Máy tính và dữ liệu tài chính minh họa kiểm tra nguồn giá",
    intro:
      "Với các trang cập nhật giá, đẹp thôi chưa đủ. Người dùng cần biết dữ liệu lấy từ đâu, cập nhật khi nào, có fallback hay không và sai số có thể đến từ đâu.",
    takeaways: [
      "Luôn xem nguồn dữ liệu và thời điểm cập nhật.",
      "Cẩn trọng với trang không nói rõ giá tham khảo hay giá giao dịch.",
      "Một hệ thống tốt nên công khai cache, fallback và giới hạn dữ liệu.",
    ],
    sections: [
      {
        heading: "Ba câu hỏi cần hỏi trước khi tin một con số",
        body: [
          "Thứ nhất, con số này lấy từ nguồn nào? Thứ hai, được cập nhật lúc nào? Thứ ba, đây là giá tham khảo hay giá giao dịch có thể chốt ngay?",
          "Nếu một website không trả lời được ba câu hỏi này, bạn nên xem dữ liệu như gợi ý ban đầu thay vì cơ sở giao dịch.",
        ],
      },
      {
        heading: "Fallback không xấu, nhưng phải minh bạch",
        body: [
          "API tài chính có thể lỗi, rate limit hoặc ngừng phản hồi. Fallback giúp website không trắng dữ liệu, nhưng cần ghi rõ source để người dùng hiểu độ tin cậy.",
          "Trên ChuyenDoiTien, các API quan trọng có source trong response và trang phương pháp dữ liệu giải thích thứ tự ưu tiên nguồn live, cache và fallback.",
        ],
      },
    ],
    tools: [defaultTools[2], defaultTools[0], defaultTools[1]],
  },
];

export const blogCategories = [
  {
    name: "Tỷ giá",
    description: "USD/VND, số tiền thực nhận, biểu đồ và phí giao dịch.",
    href: "/currency",
  },
  {
    name: "Vàng",
    description: "SJC, PNJ, DOJI, chỉ, lượng và quy đổi vàng sang VND/USD.",
    href: "/gold",
  },
  {
    name: "Crypto",
    description: "USDT/VND, P2P, phí sàn và rủi ro khi đổi sang tiền Việt.",
    href: "/crypto",
  },
  {
    name: "Dầu",
    description: "Brent, WTI và mối liên hệ với giá xăng trong nước.",
    href: "/oil",
  },
];

export const blogSeoClusters = [
  {
    label: "Trả lời nhanh",
    keywords: ["100 USD bằng bao nhiêu tiền Việt", "1 chỉ vàng bao nhiêu tiền"],
  },
  {
    label: "So sánh thị trường",
    keywords: ["giá vàng SJC PNJ DOJI", "tỷ giá USD/VND mỗi nơi khác nhau"],
  },
  {
    label: "Niềm tin dữ liệu",
    keywords: ["nguồn dữ liệu giá vàng", "giá tham khảo và giá giao dịch"],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug) {
  const post = getBlogPost(slug);
  if (!post) return blogPosts.slice(0, 3);

  return blogPosts
    .filter((item) => item.slug !== slug)
    .sort((a, b) => {
      const categoryScore = Number(b.category === post.category) - Number(a.category === post.category);
      if (categoryScore !== 0) return categoryScore;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 3);
}
