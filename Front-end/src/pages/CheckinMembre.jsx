import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCode } from "react-qr-code";
import socket from "../../Websocket";

export default function CheckinMembre() {
  const [isConnected, setIsConnected] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [welcomMsg, setWelcomMsg] = useState(null);
  const [QrScanned, setQrScanned] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (socket.connected) { setIsConnected(true); socket.emit("join-display"); }
    socket.connect();
    socket.on("connect", () => { setIsConnected(true); socket.emit("join-display"); });
    socket.on("newQR", (data) => setQrValue(data.url));
    socket.on("welcomMsg", (payload) => {
      const { type, name, message } = payload.data;
      setWelcomMsg(name);
      setQrScanned(true);
      setIsError(type === "error");
      setErrorMsg(type === "error" ? message : null);
      setTimeout(() => {
        setQrScanned(false); setWelcomMsg(null);
        setIsError(false); setErrorMsg(null); setQrValue(null);
      }, 4000);
    });
    socket.on("disconnect", () => setIsConnected(false));
    return () => {
      socket.off("connect"); socket.off("disconnect");
      socket.off("newQR"); socket.off("welcomMsg");
    };
  }, []);

  return (
    <div className="w-full h-screen bg-app flex flex-col items-center justify-center gap-6 relative">

      {/* Brand top-left */}
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/checkin')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="8.5" width="3" height="3" rx="1" fill="#fff" />
              <rect x="16" y="8.5" width="3" height="3" rx="1" fill="#fff" />
              <rect x="3" y="7" width="2" height="6" rx="0.5" fill="#fff" />
              <rect x="15" y="7" width="2" height="6" rx="0.5" fill="#fff" />
              <rect x="5" y="9.25" width="10" height="1.5" rx="0.75" fill="#fff" />
            </svg>
          </div>
          <span className="text-[16px] font-bold text-primary tracking-[-0.02em]">FitCore</span>
        </div>
      </div>

      {/* Connection status top-right */}
      <div className="absolute top-9 right-8 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-danger'}`}
          style={isConnected ? { boxShadow: '0 0 6px #4ade80' } : {}} />
        <span className="text-[12px] font-mono text-muted">{isConnected ? 'Live' : 'Offline'}</span>
      </div>

      {/* Main card */}
      <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center gap-6 w-[400px] shadow-sm">

        {!isConnected ? (
          /* Connecting */
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent animate-spin" />
            <p className="text-[13px] font-mono text-muted">Connecting{dots}</p>
          </div>

        ) : QrScanned ? (
          /* Scan result */
          <div className="flex flex-col items-center gap-4 py-4 animate-fade-up">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isError ? 'bg-danger-light' : 'bg-accent-light'
              }`}>
              {isError ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(0.48 0.16 25)" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(0.42 0.14 145)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-[22px] font-bold tracking-[-0.03em] text-center ${isError ? 'text-danger-fg' : 'text-accent-fg'
                }`}>
                {isError ? 'Access Denied' : 'Welcome!'}
              </p>
              <p className="text-[16px] font-medium text-primary text-center mt-1">{welcomMsg}</p>
              {isError && errorMsg && (
                <p className="text-[13px] text-muted text-center mt-1">{errorMsg}</p>
              )}
            </div>
          </div>

        ) : qrValue ? (
          /* QR code */
          <>
            <p className="text-[13px] font-medium text-muted text-center">Scan to check in</p>
            <div className="p-4 bg-white rounded-xl border border-border">
              <QRCode size={220} value={qrValue} />
            </div>
            <p className="text-[11px] font-mono text-muted text-center">Refreshes after each scan</p>
          </>

        ) : (
          /* Waiting for QR */
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent animate-spin" />
            <p className="text-[13px] font-mono text-muted">Waiting for QR{dots}</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-8 text-[11px] font-mono text-muted tracking-[0.06em]">
        FITCORE · CHECK-IN SYSTEM
      </p>
    </div>
  );
}