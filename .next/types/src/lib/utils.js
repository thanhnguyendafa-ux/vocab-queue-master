import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}
export function truncate(str, length) {
    return str.length > length ? "".concat(str.substring(0, length), "...") : str;
}
export function isArrayOfType(arr, check) {
    return Array.isArray(arr) && arr.every(check);
}
export function formatBytes(bytes, decimals) {
    if (decimals === void 0) { decimals = 2; }
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var dm = decimals < 0 ? 0 : decimals;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
}
export function formatCurrency(amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
export function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove non-word characters
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/--+/g, '-') // replace multiple - with single -
        .trim();
}
export function deslugify(slug) {
    return slug
        .replace(/[-_]/g, ' ') // replace - or _ with space
        .replace(/\s+/g, ' ') // replace multiple spaces with single space
        .replace(/^\s+|\s+$/g, '') // trim
        .replace(/\b\w/g, function (char) { return char.toUpperCase(); }); // capitalize first letter of each word
}
export function getInitials(name) {
    return name
        .split(' ')
        .map(function (n) { return n[0]; })
        .join('')
        .toUpperCase();
}
export function getRandomColor() {
    var colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
//# sourceMappingURL=utils.js.map