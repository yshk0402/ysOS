import React, { useState } from 'react';
import { Button95 } from '../components/SystemUI';
import { useTheme } from '../contexts/ThemeContext';

export const Calculator: React.FC = () => {
    const { theme } = useTheme();
    const isMac = theme === 'macos';
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

    const handleNumber = (num: string) => {
        if (display === '0' || shouldResetDisplay) {
            setDisplay(num);
            setShouldResetDisplay(false);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op: string) => {
        setEquation(display + ' ' + op + ' ');
        setShouldResetDisplay(true);
    };

    const handleEqual = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(equation + display);
            setDisplay(String(result));
            setEquation('');
            setShouldResetDisplay(true);
        } catch (e) {
            setDisplay('Error');
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
        setShouldResetDisplay(false);
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ];

    if (isMac) {
        return (
            <div className="flex flex-col h-full bg-[#323232] text-white p-4 font-sans">
                <div className="flex-1 flex items-end justify-end text-5xl font-light mb-4 px-2">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <button onClick={handleClear} className="h-12 rounded-full bg-[#a5a5a5] text-black text-xl font-medium hover:bg-[#d4d4d2] active:bg-[#a5a5a5] transition-colors col-span-4">AC</button>
                    {buttons.map((btn) => {
                        let bgClass = 'bg-[#505050] hover:bg-[#6b6b6b] active:bg-[#505050]';
                        if (['/', '*', '-', '+', '='].includes(btn)) {
                            bgClass = 'bg-[#ff9f0a] text-white hover:bg-[#ffb540] active:bg-[#d48408]';
                        }
                        return (
                            <button
                                key={btn}
                                onClick={() => {
                                    if (btn === 'C') handleClear();
                                    else if (btn === '=') handleEqual();
                                    else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn);
                                    else handleNumber(btn);
                                }}
                                className={`h-12 rounded-full text-2xl font-medium transition-colors ${bgClass}`}
                            >
                                {btn === '/' ? '÷' : btn === '*' ? '×' : btn}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] p-1 gap-2">
            <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1 text-right font-mono text-lg h-8 mb-1">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-1 flex-1">
                <Button95 onClick={handleClear} className="col-span-4 text-red-800">C</Button95>
                {buttons.map((btn) => (
                    <Button95
                        key={btn}
                        onClick={() => {
                            if (btn === 'C') handleClear();
                            else if (btn === '=') handleEqual();
                            else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn);
                            else handleNumber(btn);
                        }}
                        className="font-bold"
                    >
                        {btn}
                    </Button95>
                ))}
            </div>
        </div>
    );
};
