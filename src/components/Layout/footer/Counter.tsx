// components/ui/Counter.tsx
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

type CounterProps = {
  number: number;
  duration?: number;
};

export default function Counter({ number, duration = 1000 }: CounterProps) {
  const [prev, setPrev] = useState(0);

  const props = useSpring({
    from: { val: prev },
    to: { val: number },
    config: { duration },
    onRest: () => setPrev(number),
  });

  return (
    <animated.span className="font-bold text-white text-xl">
      {props.val.to((val) => Math.floor(val))}
    </animated.span>
  );
}
