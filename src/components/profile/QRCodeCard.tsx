"use client";
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function QRCodeCard({ url }: { url?: string }) {
  const { user } = useAuth();
  const [profileUrl, setProfileUrl] = useState("https://myapp.com/");

  useEffect(() => {
    // Prioritize production URL over localhost if available
    if (typeof window !== "undefined") {
      let base = window.location.origin;
      if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
        base = `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
      } else if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
        base = process.env.NEXT_PUBLIC_APP_URL;
      }
      
      const activeUser = user.dbUser || user.firebaseUser;
      if (activeUser?.username) {
         setProfileUrl(`${base}/@${activeUser.username}`);
      } else if (url) {
         // Replace localhost in provided URL if we know the production base
         const finalUrl = url.includes("localhost") && base.includes("https") 
            ? url.replace(/http:\/\/localhost:\d+/, base) 
            : url;
         setProfileUrl(finalUrl);
      }
    }
  }, [user, url]);

  const handleDownload = () => {
    const svg = document.getElementById("profile-qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "askq-qr-code.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-[var(--border)]">
        <QRCodeSVG id="profile-qr-code" value={profileUrl} size={200} level="H" includeMargin />
      </div>
      <p className="text-center text-sm text-[var(--secondary)] max-w-xs break-all">
        {profileUrl}
      </p>
      <p className="text-center text-sm text-[var(--secondary)] max-w-xs">
        Scan this QR code to ask me a question!
      </p>
      <Button variant="secondary" className="gap-2" onClick={handleDownload}>
        <Download className="w-4 h-4" /> Download QR
      </Button>
    </div>
  );
}
