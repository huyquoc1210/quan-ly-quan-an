# Refresh Token trong Next.JS

Các API yêu cầu Authentication có thể được gọi ở hai nơi

1. Server Component: Ví dụ page `/account/me` cần gọi API `me` ở server component để lấy thông tin profile của user

2. Client Component: Ví dụ page `/account/me` cần gọi API `me` ở client component để lấy thông tin profile của user

==> Hết hạn token có thể xảy ra ở Server Component ở Client Component

Các trường hợp hết hạn accessToken

- Đang dùng thì hết hạn: Chúng ta sẽ không để trường hợp này xảy ra, bằng cách có 1 setInterval check token liên tục để refresh Token trước khi nó hết hạn

- Lâu ngày không vào web , vào lại thì hết hạn

Khi vào lại website thì middleware.ts sẽ được gọi làn đầu tiên. Chúng ta se xkieerm tra xem accessTOken còn không(vì access token sẽ bị xoá khi hết hạn), nếu không còn thfi chúng ta sẽ gọi redirect về page client component có nhiệm vụ gọi API refesh token và redirect ngược về trang cũ

expAT và kiểm tra coi thử có logout auto được không

Lưu ý:

- Không cho refreshToken liên tục
- Thứ tự trong middleware

lưu ý: để tránh bị bug khi thực hiện Đang dùng thì hết hạn

- Không để refresh token bị gọi duplicate
- Khi refresh token bị lỗi ở route handler ==> trả về 401 bất kể lỗi gì
- Khi refresh token bị lỗi ở useEffect client ==> ngừng interval ngay
- Đưa logic check vào layout ở trang authenticated: Không cho chạy refresh token ở những trang mà unauthenticated như login,logout
- Kiểm tra login flow trong middleware
