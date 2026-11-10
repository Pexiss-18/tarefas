/**
 * Site estático no GitHub Pages, em https://pexiss-18.github.io/tarefas
 * (o mesmo modelo do px_financeiro). Login e dados ficam no Firebase.
 * `npm run build` gera a pasta `out/`, que é o site inteiro.
 */
const basePath = "/tarefas";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath }
};

export default nextConfig;
