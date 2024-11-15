# Xử lý caching với kĩ thuật ISR

## Nguyên nhân

- Khi cập nhật món ăn ở phía trang admin .thì khi mình reload trang chủ phía khách hàng không hiện cập nhật mới nhật mới nhất.

## Cách sửa lỗi

On-demand revalidation with **revalidateTag**

https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
