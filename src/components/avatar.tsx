/* eslint-disable @next/next/no-img-element */
export function Avatar({ name, image, size = 36 }: { name?: string | null; image?: string | null; size?: number }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return image ? (
    <img
      src={image}
      alt=""
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      className="rounded-full border border-border object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="grid place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
