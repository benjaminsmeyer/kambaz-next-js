import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import Providers from "./Providers";
export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Providers>
      <div id="wd-kambaz">
        <div className="d-flex">
          <div>
            <KambazNavigation />
          </div>
          <div className="wd-main-content-offset p-3 flex-fill">{children}</div>
        </div>
      </div>
    </Providers>
  );
}
