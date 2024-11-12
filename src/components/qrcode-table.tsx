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
    const canvas = canvasRef.current;

    QRCode.toCanvas(
      canvas,
      getTableLink({
        token,
        tableNumber,
      }),
      {
        width,
      },
      function (error) {
        if (error) console.error(error);
        console.log("success!");
      }
    );
  }, [tableNumber, token, width]);

  return <canvas ref={canvasRef}></canvas>;
};

export default QRCodeTable;
