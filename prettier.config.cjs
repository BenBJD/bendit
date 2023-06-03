/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
    singleQuote: false,
    semi: false,
    tabWidth: 2,
}

module.exports = config
