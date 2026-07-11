import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function TextScramble({
  text,
  className = "",
  style,
  speed = 30,
  delay = 0,
  tag = "span",
}: Props) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let iteration = 0;
    const totalIterations = Math.ceil(text.length / 0.5);

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration * 0.5) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > totalIterations) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, started]);

  const Tag = motion[tag] as any;

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: started ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {display || "\u00A0"}
    </Tag>
  );
}
