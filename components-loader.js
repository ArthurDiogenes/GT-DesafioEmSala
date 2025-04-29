/**
 * Carregador de componentes
 * Carrega os componentes HTML de forma assíncrona
 */
class ComponentsLoader {
    constructor() {
        this.componentsPath = 'components/';
        this.components = [
            { id: 'header-container', file: 'header.html' },
            { id: 'hero-container', file: 'hero.html' },
            { id: 'impact-container', file: 'impact.html' },
            { id: 'benefits-container', file: 'benefits.html' },
            { id: 'testimonials-container', file: 'testimonials.html' },
            { id: 'footer-container', file: 'footer.html' }
        ];
    }
    /**
     * Carrega um componente HTML
     * @param {string} url - URL do arquivo HTML
     * @returns {Promise<string>} - Conteúdo HTML
     */
    async fetchComponent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${url}: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Erro ao carregar componente: ${error.message}`);
            return `<div class="error">Erro ao carregar componente: ${error.message}</div>`;
        }
    }
    /**
     * Carrega todos os componentes
     */
    async loadAllComponents() {
        console.log('Iniciando carregamento de componentes...');
        const loadPromises = this.components.map(async (component) => {
            const url = this.componentsPath + component.file;
            console.log(`Carregando componente: ${url}`);
            const html = await this.fetchComponent(url);
            const container = document.getElementById(component.id);
            if (container) {
                console.log(`Container #${component.id} encontrado, inserindo HTML`);
                container.innerHTML = html;
            } else {
                console.warn(`Container #${component.id} não encontrado`);
            }
            return { id: component.id, loaded: !!container };
        });
        const results = await Promise.all(loadPromises);
        console.log('Componentes carregados:', results);
        
        // Dispara um evento quando todos os componentes forem carregados
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
}
// Inicializa o carregador de componentes quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando ComponentsLoader');
    const loader = new ComponentsLoader();
    loader.loadAllComponents();
});