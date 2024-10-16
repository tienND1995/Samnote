function IconLogout({ className, fill = "white" }) {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 26.25V23.75H23.75V6.25H15V3.75H26.25V26.25H15ZM12.5 21.25L10.7812 19.4375L13.9688 16.25H3.75V13.75H13.9688L10.7812 10.5625L12.5 8.75L18.75 15L12.5 21.25Z"
        fill={fill}
      />
    </svg>
  );
}

export default IconLogout;
