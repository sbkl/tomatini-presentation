import localFont from "next/font/local";

// export const santral = localFont({
//   src: [
//     {
//       path: "../../public/assets/fonts/SantralW01Normal300.woff",
//       weight: "300",
//       style: "normal",
//       // light - 300
//     },
//     {
//       path: "../../public/assets/fonts/SantralW01Normal400.woff",
//       weight: "400",
//       style: "normal",
//       // normal - 400
//     },
//     {
//       path: "../../public/assets/fonts/SantralW01Normal600.woff",
//       weight: "600",
//       style: "normal",
//       // semibold - 600
//     },
//     {
//       path: "../../public/assets/fonts/SantralW01Normal700.woff",
//       weight: "700",
//       style: "normal",
//       // bold - 700
//     },
//   ],
//   variable: "--font-santral",
//   display: "swap",
// });

export const versailles = localFont({
  src: "../../public/assets/versailles-lt-std.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-versailles",
});
