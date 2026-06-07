import RestTimer from '../components/workout/RestTimer';

export default function RestScreen({ lastSet, prBroken, xpEarned, onNextSet, onEndSession }) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Rest up</h1>
      <RestTimer
        lastSet={lastSet}
        prBroken={prBroken}
        xpEarned={xpEarned}
        onNextSet={onNextSet}
        onEndSession={onEndSession}
      />
    </div>
  );
}
