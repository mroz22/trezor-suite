import { bytesToHumanReadable } from '../src/bytesToHumanReadable';

it('bytesToHumanReadable', () => {
    expect(bytesToHumanReadable(0)).toBe('0.0 B');
    expect(bytesToHumanReadable(512)).toBe('512.0 B');
    expect(bytesToHumanReadable(1024)).toBe('1.0 KB');
    expect(bytesToHumanReadable(1536)).toBe('1.5 KB');
    expect(bytesToHumanReadable(1024 ** 2)).toBe('1.0 MB');
    expect(bytesToHumanReadable(1024 ** 3)).toBe('1.0 GB');
    expect(bytesToHumanReadable(1024 ** 4)).toBe('1.0 TB');
    // negative input is taken through Math.abs
    expect(bytesToHumanReadable(-2048)).toBe('2.0 KB');
    // clamps at the largest unit instead of running past the table (previously an unbounded loop)
    expect(bytesToHumanReadable(1024 ** 5)).toBe('1024.0 TB');
    expect(bytesToHumanReadable(1024 ** 6)).toBe('1048576.0 TB');
});
