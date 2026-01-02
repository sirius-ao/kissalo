import logo from "@/assets/images/Group 39737.png";
import logoTitle from "@/assets/images/logoTitle.png";
import logoImage from "@/assets/images/logoSolo.png";
import Image from "next/image";

export function LogoImageComonent() {
  return <Image src={logoImage} alt="LogoImage" />;
}

export function LogoTitileComonent() {
  return <Image src={logoTitle} alt="logoTitle" />;
}
export function Logo() {
  return <Image src={logo} alt="logo" />;
}
