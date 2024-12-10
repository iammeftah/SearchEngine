import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import SearchForm from '../components/SearchForm';

const AnimatedCircle: React.FC<{
    className: string;
    duration: number;
    initialPosition: { x: string; y: string };
}> = ({ className, duration, initialPosition }) => {
    return (
        <motion.div
            className={`rounded-full blur-[100px] opacity-50 absolute ${className}`}
            animate={{
                rotate: 360,
                x: [
                    `calc(${initialPosition.x} + 50px)`,
                    `calc(${initialPosition.x} - 50px)`,
                    `calc(${initialPosition.x} + 50px)`
                ],
                y: [
                    `calc(${initialPosition.y} + 50px)`,
                    `calc(${initialPosition.y} - 50px)`,
                    `calc(${initialPosition.y} + 50px)`
                ]
            }}
            transition={{
                rotate: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                },
                x: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                },
                y: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }
            }}
        />
    );
};

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-gray-950 text-black dark:text-white">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center py-8 px-4 relative">
                <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <AnimatedCircle
                        className="w-[300px] h-[300px] bg-red-300 dark:bg-red-700 top-1/4 right-1/4"
                        duration={30}
                        initialPosition={{ x: "25%", y: "25%" }}
                    />
                    <AnimatedCircle
                        className="w-[250px] h-[250px] bg-blue-300 dark:bg-blue-700 bottom-1/4 left-1/4"
                        duration={35}
                        initialPosition={{ x: "-25%", y: "-25%" }}
                    />
                    <AnimatedCircle
                        className="w-[200px] h-[200px] bg-cyan-300 dark:bg-cyan-700 top-1/3 left-1/3"
                        duration={40}
                        initialPosition={{ x: "33%", y: "33%" }}
                    />
                    <AnimatedCircle
                        className="w-[350px] h-[350px] bg-purple-300 dark:bg-purple-700 bottom-1/3 right-1/3"
                        duration={45}
                        initialPosition={{ x: "-33%", y: "-33%" }}
                    />
                </motion.div>
                <div className="w-full z-10 flex justify-center items-center flex-col rounded-lg p-8">
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-rose-500">C</span>hapronRouge<span className="text-rose-500">.</span>
                    </motion.h1>
                    <motion.div
                        className="w-full max-w-3xl border-none outline-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <SearchForm />
                    </motion.div>
                    <motion.p
                        className="mt-8 text-center text-lg opacity-75"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Discover knowledge with our powerful search engine
                    </motion.p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;