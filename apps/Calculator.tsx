import React, { useState } from 'react';
import { Button95 } from '../components/SystemUI';

export const Calculator: React.FC = () => {
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
