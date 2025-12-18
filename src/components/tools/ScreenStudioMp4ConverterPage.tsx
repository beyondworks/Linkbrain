import * as React from "react";
import {
  CheckCircle2,
  ChevronRight,
  FileVideo,
  Folder,
  FolderOpen,
  HardDrive,
  Play,
  RefreshCcw,
  Search,
  Zap,
} from "lucide-react";

import { cn } from "@/components/ui/utils";

type Step = "setup" | "scanning" | "selecting" | "converting" | "completed";

type ScannedProject = {
  id: string;
  name: string;
  selected: boolean;
};

const MOCK_PROJECTS: ScannedProject[] = [
  { id: "p1", name: "LED MONITOR 2025-09-23 21:43:13.screenstudio", selected: true },
  { id: "p2", name: "LED MONITOR 2025-12-15 18:56:13.screenstudio", selected: true },
  { id: "p3", name: "LED MONITOR 2025-12-18 18:28:58.screenstudio", selected: true },
];

function PathInput({
  label,
  value,
  onChange,
  icon: Icon,
  buttonLabel = "Select",
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  buttonLabel?: string;
}) {
  return (
    <div className="group relative">
      <label className="mb-2 ml-1 block text-xs font-bold tracking-widest text-zinc-400 uppercase">
        {label}
      </label>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-zinc-500 transition-colors group-focus-within:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 pl-11 pr-20",
            "text-xs font-mono text-zinc-200 shadow-inner outline-none transition-colors",
            "hover:bg-zinc-950/70 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
          )}
        />
        <button
          type="button"
          className="absolute right-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function OptionToggle({
  checked,
  label,
  subLabel,
  onChange,
}: {
  checked: boolean;
  label: string;
  subLabel?: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
        checked
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-white/10 bg-zinc-950 hover:bg-zinc-950/70"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-zinc-100">{label}</span>
        {subLabel ? <span className="text-xs text-zinc-500">{subLabel}</span> : null}
      </div>
      <div
        className={cn(
          "h-5 w-10 rounded-full border p-0.5 transition-colors",
          checked ? "border-emerald-500/40 bg-emerald-500/20" : "border-white/10 bg-zinc-900"
        )}
      >
        <div
          className={cn(
            "h-4 w-4 rounded-full transition-transform",
            checked ? "translate-x-5 bg-emerald-400" : "translate-x-0 bg-zinc-400"
          )}
        />
      </div>
    </button>
  );
}

function MainActionButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border border-white/10",
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500",
        "px-6 py-4 text-sm font-bold tracking-wide text-black transition-all",
        disabled ? "cursor-not-allowed opacity-50 grayscale" : "hover:brightness-110"
      )}
    >
      <div className="relative flex items-center justify-center gap-3">
        <Icon className="h-5 w-5 text-black/80" />
        <span>{label}</span>
      </div>
    </button>
  );
}

export function ScreenStudioMp4ConverterPage() {
  const [step, setStep] = React.useState<Step>("setup");

  const [inputPath, setInputPath] = React.useState("~/Screen Studio Projects");
  const [outputPath, setOutputPath] = React.useState("~/Screen Studio Projects/Exports");

  const [recursive, setRecursive] = React.useState(false);
  const [overwrite, setOverwrite] = React.useState(false);
  const [enableCursorZoom, setEnableCursorZoom] = React.useState(true);
  const [invertCursorY, setInvertCursorY] = React.useState(false);

  const [scannedProjects, setScannedProjects] = React.useState<ScannedProject[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [loadingStep, setLoadingStep] = React.useState("");

  const selectedCount = scannedProjects.filter((p) => p.selected).length;

  const handleScan = () => {
    setStep("scanning");
    window.setTimeout(() => {
      setScannedProjects(MOCK_PROJECTS);
      setStep("selecting");
    }, 900);
  };

  const toggleSelection = (id: string) => {
    setScannedProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const startConversion = () => {
    if (selectedCount === 0) return;
    setProgress(0);
    setLoadingStep("프로젝트 분석 중…");
    setStep("converting");
  };

  const reset = () => {
    setScannedProjects([]);
    setProgress(0);
    setLoadingStep("");
    setStep("setup");
  };

  React.useEffect(() => {
    if (step !== "converting") return;

    const steps = [
      "project.json 로드 중…",
      "zoomRanges 계산/정규화 중…",
      enableCursorZoom ? "커서 따라 줌(Zoom) 렌더링 중…" : "커서 줌 비활성(원본 트랙 내보내기)…",
      "MP4 내보내기(Export) 진행 중…",
      "결과 정리 중…",
    ];

    let currentProgress = 0;
    let stepIndex = 0;
    setLoadingStep(steps[0]);

    const interval = window.setInterval(() => {
      currentProgress += 1.2 + Math.random() * 2.2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        window.clearInterval(interval);
        window.setTimeout(() => setStep("completed"), 500);
      }

      if (currentProgress > (stepIndex + 1) * 20 && stepIndex < steps.length - 1) {
        stepIndex += 1;
        setLoadingStep(steps[stepIndex]);
      }

      setProgress(currentProgress);
    }, 70);

    return () => window.clearInterval(interval);
  }, [enableCursorZoom, step]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-6">
        <div className="flex items-center gap-3 select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
            <Zap className="h-4 w-4 text-black/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none text-zinc-100">ScreenStudio → MP4</span>
            <span className="mt-0.5 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              Desktop Exporter UI (Web Preview)
            </span>
          </div>
        </div>
        <a
          href="/#app"
          className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-900"
        >
          Linkbrain로 돌아가기
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 pb-10">
          <div className="relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/40 via-teal-500/30 to-emerald-500/40 blur-sm" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur">
            <div className="border-b border-white/10 bg-zinc-950/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {step === "setup" && "새 변환 작업"}
                    {step === "scanning" && "폴더 스캔 중…"}
                    {step === "selecting" && "프로젝트 선택"}
                    {step === "converting" && "내보내기(Export) 중…"}
                    {step === "completed" && "완료"}
                  </h1>
                  <p className="mt-1 text-xs text-zinc-500">
                    {step === "setup" && "입력/출력 폴더와 옵션을 설정한 다음 스캔하세요."}
                    {step === "scanning" && "`.screenstudio` 프로젝트를 찾는 중입니다."}
                    {step === "selecting" && `${scannedProjects.length}개의 프로젝트를 찾았습니다.`}
                    {step === "converting" && loadingStep}
                    {step === "completed" && "MP4 내보내기가 완료되었습니다."}
                  </p>
                </div>

                {step === "selecting" ? (
                  <button
                    type="button"
                    onClick={() => setStep("setup")}
                    className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-900"
                  >
                    설정 변경
                  </button>
                ) : null}
              </div>
            </div>

            <div className="p-6">
              {step === "setup" ? (
                <div className="flex flex-col gap-8">
                  <div className="grid gap-4">
                    <PathInput label="입력 폴더" value={inputPath} onChange={setInputPath} icon={Folder} />
                    <div className="relative flex justify-center">
                      <div className="rounded-full border border-white/10 bg-zinc-950 p-1 text-zinc-500 shadow">
                        <ChevronRight className="h-3 w-3 rotate-90" />
                      </div>
                    </div>
                    <PathInput
                      label="출력 폴더"
                      value={outputPath}
                      onChange={setOutputPath}
                      icon={HardDrive}
                      buttonLabel="Select"
                    />
                  </div>

                  <div className="h-px w-full bg-white/10" />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OptionToggle
                      checked={enableCursorZoom}
                      label="커서 따라 줌(Zoom) 적용"
                      subLabel="project.json의 zoomRanges + mousemoves 기반"
                      onChange={setEnableCursorZoom}
                    />
                    <OptionToggle
                      checked={invertCursorY}
                      label="Y축 반전(필요시)"
                      subLabel="줌이 상하로 뒤집혀 따라갈 때"
                      onChange={setInvertCursorY}
                    />
                    <OptionToggle
                      checked={recursive}
                      label="하위 폴더까지 스캔"
                      subLabel="`.screenstudio`를 재귀적으로 탐색"
                      onChange={setRecursive}
                    />
                    <OptionToggle
                      checked={overwrite}
                      label="덮어쓰기"
                      subLabel="동일 이름 mp4가 있으면 교체"
                      onChange={setOverwrite}
                    />
                  </div>

                  <MainActionButton label="스캔 시작" icon={Search} onClick={handleScan} />
                </div>
              ) : null}

              {step === "scanning" ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="mb-8 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <RefreshCcw className="h-10 w-10 animate-spin text-emerald-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">스캔 중…</h3>
                    <p className="mt-2 text-xs font-mono text-zinc-500">{inputPath}</p>
                  </div>
                </div>
              ) : null}

              {step === "selecting" ? (
                <div className="flex flex-col">
                  <div className="flex-1 space-y-2">
                    {scannedProjects.map((project) => (
                      <div
                        key={project.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSelection(project.id)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? toggleSelection(project.id) : null)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                          project.selected
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-white/10 bg-zinc-950 hover:bg-zinc-950/70"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border",
                            project.selected ? "border-emerald-500 bg-emerald-500" : "border-zinc-600"
                          )}
                        >
                          {project.selected ? <CheckCircle2 className="h-3 w-3 text-black" /> : null}
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
                          <FileVideo className="h-4 w-4 text-zinc-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-zinc-100">{project.name}</div>
                          <div className="mt-0.5 text-xs font-mono text-zinc-500">
                            {enableCursorZoom ? "cursor-zoom: on" : "cursor-zoom: off"} • overwrite:{" "}
                            {overwrite ? "on" : "off"}
                          </div>
                        </div>

                        <div
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-semibold",
                            project.selected ? "bg-emerald-500/20 text-emerald-200" : "bg-zinc-900 text-zinc-500"
                          )}
                        >
                          {project.selected ? "변환" : "제외"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
                    <div className="flex-1">
                      <div className="text-xs text-zinc-300">
                        선택됨: <span className="font-bold text-white">{selectedCount}</span> /{" "}
                        {scannedProjects.length}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        커서 줌: {enableCursorZoom ? "ON" : "OFF"} • Y반전: {invertCursorY ? "ON" : "OFF"} • 재귀
                        스캔: {recursive ? "ON" : "OFF"}
                      </div>
                    </div>
                    <div className="w-52">
                      <MainActionButton label="변환 시작" icon={Play} onClick={startConversion} disabled={selectedCount === 0} />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === "converting" ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-full max-w-sm">
                    <div className="mb-6 flex items-end justify-center gap-1">
                      {Array.from({ length: 14 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 animate-pulse rounded-full bg-emerald-500/60"
                          style={{
                            height: `${18 + ((idx * 13) % 34)}px`,
                            animationDelay: `${idx * 0.05}s`,
                            opacity: 0.35 + ((idx % 5) * 0.12),
                          }}
                        />
                      ))}
                    </div>

                    <div className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-extrabold tracking-tight tabular-nums text-white">
                        {Math.round(progress)}%
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-200">{loadingStep}</span>
                      </div>
                      <div className="mt-6 text-xs text-zinc-500">
                        이 화면은 디자인 프리뷰이며, 실제 변환은 macOS 앱에서 수행됩니다.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === "completed" ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">완료</h2>
                  <p className="mt-2 text-center text-sm text-zinc-400">
                    선택한 {selectedCount}개 프로젝트를 MP4로 내보냈습니다.
                    <br />
                    <span className="font-mono text-zinc-300">{outputPath}</span>
                  </p>

                  <div className="mt-8 flex w-full max-w-sm gap-3">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-900"
                      onClick={() => window.alert("macOS 앱에서는 Finder에서 출력 폴더를 열 수 있어요.")}
                    >
                      <FolderOpen className="h-4 w-4 text-zinc-400" />
                      출력 폴더 열기
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-emerald-500/20 px-4 py-3 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
                      onClick={reset}
                    >
                      새 작업
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
