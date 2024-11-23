# Cập nhập một số thay đổi về logic Server

## Table

- Khi thay đổi token của table thì server sẽ xoá các refresh token của guest liên quan đến table đó. Điều này sẽ làm cho Guest đó phải đăng nhập lại khi access token kết thúc. Mục đích là ngăn chặn việc guest khi đặt đơn hàng phá quán

- Status table là Hidden, Reversed thì guest sẽ không thể login và gọi món từ bàn đó

- Status table là Hidden thì Admin/employee cũng không thể tạo order từ bàn đó. Chỉ còn Reversed thì admin/employee có thể tạo đơn hàng từ bàn đó.

## Guest

- Thêm api tạo guest, get danh sách guests

## Order

- Thêm API tạo order cho admin/employee
