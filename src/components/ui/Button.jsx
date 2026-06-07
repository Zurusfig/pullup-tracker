import { motion } from 'framer-motion';

const COLORS = {
  green: 'bg-brand-green border-green-700 text-white',
  purple: 'bg-brand-purple border-purple-800 text-white',
  blue: 'bg-brand-blue border-blue-700 text-white',
  orange: 'bg-brand-orange border-orange-700 text-white',
  red: 'bg-brand-red border-red-700 text-white',
  gray: 'bg-gray-200 border-gray-400 text-gray-800 dark:bg-gray-700 dark:border-gray-900 dark:text-white',
};

export default function Button({
  children,
  color = 'green',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) {
  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.97, y: 2 }}
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-4 px-6 rounded-2xl font-extrabold text-lg border-b-4
        transition-colors active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed
        ${COLORS[color]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
