export default function WeatherData({
  airTemp,
  trackTemp,
  humidity,
}: {
  airTemp: string;
  trackTemp: string;
  humidity: string;
}) {
  return (
    <div className="grid grid-flow-col items-start gap-[22px] rounded-[8px] border border-card-border bg-card px-5 py-[14px]">
      <WeatherCell label="AIR" value={`${Number(airTemp).toFixed(1)} C°`} />
      <WeatherCell label="TRACK" value={`${Number(trackTemp).toFixed(1)} C°`} />
      <WeatherCell label="HUMIDITY" value={`${humidity} %`} />
    </div>
  );
}

function WeatherCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-rows-2 gap-[3px]">
      <span className="text-[9px] font-sans font-medium tracking-[.12em] text-faint">
        {label}
      </span>
      <span className="text-[16px] font-mono font-medium text-ink">
        {value}
      </span>
    </div>
  );
}
