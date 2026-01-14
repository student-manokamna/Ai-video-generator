import { AbsoluteFill, Audio, Sequence, useCurrentFrame } from "remotion";

export interface SlideProps {
  title: string;
  subtitle?: string;
  audioFileName?: string;
  narration: string;
  durationInFrames: number;
}

type SlideCompositionProps = {
  slides: SlideProps[];
  fps: number;
};

export const SlideComposition = ({ slides, fps }: SlideCompositionProps) => {
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {slides.map((slide, index) => {
        const startFrame = currentFrame;
        const duration = slide.durationInFrames;
        currentFrame += duration;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <SlideContent slide={slide} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

type SlideContentProps = {
  slide: SlideProps;
};

const SlideContent = ({ slide }: SlideContentProps) => {
  const frame = useCurrentFrame();

  const opacity = Math.min(1, frame / 15);
  const translateY = Math.max(0, 20 - frame);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {slide.audioFileName && <Audio src={slide.audioFileName} />}

      <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 20,
            background: "linear-gradient(90deg, #00d4ff, #0099ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            style={{
              fontSize: 32,
              color: "#a0a0a0",
              marginBottom: 40,
            }}
          >
            {slide.subtitle}
          </p>
        )}

        <div
          style={{
            fontSize: 24,
            lineHeight: 1.6,
            color: "#e0e0e0",
          }}
        >
          {slide.narration}
        </div>
      </div>
    </AbsoluteFill>
  );
};
