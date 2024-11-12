import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

interface Props {
  token: string;
  tableNumber: number;
  width?: number;
}

const QRCodeTable = (props: Props) => {
  const { token, tableNumber, width = 250 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hiện tại : Thư viện QRCode nó sẽ vẽ lên cái thẻ Canvas
    // Bây giờ: Chúng ta sẽ tạo 1 cái thẻ canvas ảo dẻ thư viện QRcode nó sẽ về QR  lên trên đó
    // Và chúng ta sẽ edit thẻ canvas thật
    // Cuối cùng thì chúng ta sẽ đưa cái thẻ canvas ảo chứa QR code ở trên vào thẻ Canvas thật
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = width + 70;
    canvas.width = width;

    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;

    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    );

    const virtualCanvas = document.createElement("canvas");

    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      {
        width,
        margin: 4,
      },
      function (error) {
        if (error) console.error(error);
        console.log("success!");
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      }
    );
  }, [tableNumber, token, width]);

  return <canvas ref={canvasRef}></canvas>;
};

export default QRCodeTable;
