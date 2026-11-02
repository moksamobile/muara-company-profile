import {createRoot} from "react-dom/client";
import MuaraWebsite from "./muara-website";
import "./styles.css";
const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT || "https://muara-rantai-pasok.densecivet1.chatgpt.site/api/inquiries";
createRoot(document.getElementById("root")!).render(<MuaraWebsite inquiryEndpoint={endpoint}/>);
