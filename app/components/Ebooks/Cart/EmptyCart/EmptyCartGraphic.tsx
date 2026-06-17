import styles from "./EmptyCartGraphic.module.css";

type EmptyCartGraphicProps = {
  className?: string;
};

// Koszyk line-art z dwiema minami przełączającymi się w pętli.
// Kolor steruje `color` (currentColor) na elemencie.
export default function EmptyCartGraphic({ className }: EmptyCartGraphicProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 99 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- KOSZYK (stały) --- */}
      <path
        d="M3.88452 16.63L16.8845 15.53C18.5056 15.3881 20.1263 15.8073 21.4752 16.7175C22.8241 17.6277 23.8194 18.9736 24.2945 20.53L36.7545 62.23L34.3145 66.6C33.6878 67.726 33.3784 69.0009 33.4193 70.2889C33.4603 71.5769 33.85 72.8296 34.5469 73.9135C35.2439 74.9974 36.2219 75.8719 37.3768 76.4436C38.5316 77.0153 39.82 77.2629 41.1045 77.16L91.0045 72.92"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.1545 26.86L84.1545 21.94C84.7259 21.891 85.3009 21.9714 85.837 22.175C86.3731 22.3786 86.8565 22.7003 87.2513 23.1162C87.646 23.5321 87.9421 24.0316 88.1175 24.5776C88.293 25.1235 88.3432 25.702 88.2645 26.27L84.3345 54.64C84.2152 55.4912 83.813 56.2775 83.1927 56.8724C82.5724 57.4673 81.77 57.8363 80.9145 57.92L36.7545 62.23L26.1545 26.86Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.6546 86.72C49.2558 86.72 51.3646 84.6113 51.3646 82.01C51.3646 79.4088 49.2558 77.3 46.6546 77.3C44.0533 77.3 41.9446 79.4088 41.9446 82.01C41.9446 84.6113 44.0533 86.72 46.6546 86.72Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M79.4544 83.94C82.0556 83.94 84.1644 81.8313 84.1644 79.23C84.1644 76.6288 82.0556 74.52 79.4544 74.52C76.8531 74.52 74.7444 76.6288 74.7444 79.23C74.7444 81.8313 76.8531 83.94 79.4544 83.94Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.179 14.404L1.92309 15.4439C0.860995 15.5341 0.0730566 16.4681 0.163177 17.5302C0.253296 18.5923 1.18735 19.3802 2.24944 19.2901L14.5054 18.2502C15.5675 18.1601 16.3554 17.226 16.2653 16.1639C16.1752 15.1018 15.2411 14.3139 14.179 14.404Z"
        fill="currentColor"
      />
      <path
        d="M17.1145 80.62V84.93"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9646 82.77H19.2646"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M85.8245 0.5V4.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M83.6746 2.65002H87.9746"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.9146 13.35V17.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.7544 15.5H37.0644"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M96.5544 29.16C97.1178 29.16 97.5744 28.7033 97.5744 28.14C97.5744 27.5767 97.1178 27.12 96.5544 27.12C95.9911 27.12 95.5344 27.5767 95.5344 28.14C95.5344 28.7033 95.9911 29.16 96.5544 29.16Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58.4346 19.99C58.9758 19.99 59.4146 19.5512 59.4146 19.01C59.4146 18.4688 58.9758 18.03 58.4346 18.03C57.8934 18.03 57.4546 18.4688 57.4546 19.01C57.4546 19.5512 57.8934 19.99 58.4346 19.99Z"
        fill="currentColor"
      />

      {/* --- MINA A: uśmiech + oczy (oryginalna) --- */}
      <g className={styles.faceA}>
        <path
          d="M50.5745 48.77C50.8136 46.9449 51.6695 45.2565 53.0001 43.9847C54.3308 42.7129 56.0562 41.9342 57.8902 41.7778C59.7242 41.6213 61.5566 42.0966 63.0834 43.1246C64.6102 44.1527 65.7397 45.6718 66.2845 47.43"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M66.4144 37.98C67.033 37.98 67.5344 37.4786 67.5344 36.86C67.5344 36.2415 67.033 35.74 66.4144 35.74C65.7959 35.74 65.2944 36.2415 65.2944 36.86C65.2944 37.4786 65.7959 37.98 66.4144 37.98Z"
          fill="currentColor"
        />
        <path
          d="M48.6644 39.48C49.283 39.48 49.7844 38.9786 49.7844 38.36C49.7844 37.7415 49.283 37.24 48.6644 37.24C48.0459 37.24 47.5444 37.7415 47.5444 38.36C47.5444 38.9786 48.0459 39.48 48.6644 39.48Z"
          fill="currentColor"
        />
      </g>

      {/* --- MINA B: smutek + brwi (nowa) --- */}
      {/* translate/scale dopasowują minę z viewBox 30x18 do miejsca twarzy */}
      <g className={styles.faceB} transform="translate(46.5 34.8) scale(0.75)">
        <path
          d="M21.2449 17.0951C21.5716 17.0873 21.8881 16.9803 22.1525 16.7884C22.4169 16.5964 22.6167 16.3285 22.7252 16.0203C22.8337 15.7121 22.8459 15.3781 22.7601 15.0628C22.6743 14.7475 22.4946 14.4658 22.2449 14.2551C20.159 12.5274 17.5295 11.5929 14.8212 11.6167C12.1128 11.6404 9.50009 12.621 7.4449 14.3851C7.19725 14.5951 7.01934 14.8754 6.93481 15.1889C6.85028 15.5024 6.86313 15.8342 6.97165 16.1402C7.08016 16.4462 7.27921 16.712 7.54236 16.9022C7.8055 17.0924 8.12029 17.198 8.4449 17.2051L21.2449 17.0951Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.415 7.08511L23.585 3.72511L29.415 0.355103"
          stroke="currentColor"
          strokeWidth="0.71"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.35498 7.08511L6.18498 3.72511L0.35498 0.355103"
          stroke="currentColor"
          strokeWidth="0.71"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
