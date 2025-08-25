type Props = {
  seconds: number;
};

export default function AuthCodeTimer({ seconds }: Props) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;

  return (
    <div className='text-sm text-gray-500'>{`유효시간: ${formattedTime}`}</div>
  );
}
