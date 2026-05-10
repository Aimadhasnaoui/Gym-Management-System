import { useEffect, useState } from 'react';
import { QRCode } from "react-qr-code";
import socket from "../../Websocket";

export default function CheckinMembre() {
  const [isConnected, setIsConnected] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [welcomMsg, setWelcomMsg] = useState(null);
  const [QrScanned, setQrScanned] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Socket may have already connected before this listener was registered
    if (socket.connected) {
      console.log("Already connected to WebSocket server");
      setIsConnected(true);
      socket.emit("join-display"); // join the display room
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      socket.emit("join-display"); // join the display room
    });

    // Receive a new unique QR code from the backend
    socket.on("newQR", (data) => {
      console.log("New QR received:", data.id);
      setQrValue(data.url);
    });

    // Receive welcome or error message when QR is scanned
    socket.on("welcomMsg", (payload) => {
      const { type, name, message } = payload.data;
      console.log("Response received for:", name, "Type:", type);

      setWelcomMsg(name);
      setQrScanned(true);

      if (type === "error") {
        setIsError(true);
        setErrorMsg(message);
      } else {
        setIsError(false);
        setErrorMsg(null);
      }

      setTimeout(() => {
        setQrScanned(false);
        setWelcomMsg(null);
        setIsError(false);
        setErrorMsg(null);
        setQrValue(null);
      }, 4000);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newQR");
      socket.off("welcomMsg");
    };
  }, []);

  return (
    <div className="w-full h-screen bg-accent flex items-center justify-center">
      {isConnected ? (
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 min-w-[350px]">
          {QrScanned ? (
            isError ? (
              <div className="flex flex-col items-center text-center ">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Attention</h2>
                <p className="text-xl text-red-600 mt-2 font-medium leading-tight">{errorMsg}</p>
                <p className="text-gray-500 mt-2 font-medium">{welcomMsg}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center animate-pulse">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Bienvenue !</h2>
                <p className="text-xl text-gray-600 mt-2 font-medium">{welcomMsg}</p>
              </div>
            )
          ) : qrValue ? (
            <>
              <p className="text-lg text-gray-600 font-bold">Scannez pour valider le check-in</p>
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <QRCode size={256} value={qrValue} />
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-base">En attente du QR code...</p>
          )}
        </div>
      ) : (
        <p className="text-white text-lg">Connexion en cours...</p>
      )}
    </div>

  );
}
