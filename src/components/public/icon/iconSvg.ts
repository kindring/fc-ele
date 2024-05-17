import iconSvg from './iconSvg.vue';

export function bindIconSvg(app: any) {
    app.component('iconSvg', iconSvg);
    return app;
}
