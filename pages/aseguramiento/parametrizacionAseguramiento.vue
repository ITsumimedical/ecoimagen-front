<template>
    <div>
        <v-card>
            <v-card elevation="0">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                <span>Parametrización de aseguramiento</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>
            </v-card>
            <v-tabs grow next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows v-model="tab">
                <v-tab v-for="item in items" :key="item.tab">
                    {{ item.tab }}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in items" :key="item.tab">
                    <component :is="item.content"></component>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </div>
</template>

<script>
import tipoAfiliacionComponent from '@/components/aseguramiento/parametrizacion/TipoAfiliacionComponente.vue'
import tipoAfiliadoComponent from '@/components/aseguramiento/parametrizacion/TipoAfiliadoComponente.vue'
import clasificacionComponent from '~/components/aseguramiento/parametrizacion/ClasificacionComponente.vue'
import tipoNovedadComponent from '@/components/aseguramiento/parametrizacion/TipoNovedadesComponente.vue'
import subRegionComponent from '@/components/aseguramiento/parametrizacion/SubregionComponente.vue'

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('asegurador.menu.parametrizacion')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonParametrizacion',

    data() {
        return {
            tab: null,
            items: [{
                tab: 'Tipo Afiliación',
                content: tipoAfiliacionComponent,
            },
            {
                tab: 'Tipo Afiliado',
                content: tipoAfiliadoComponent,
            },
            {
                tab: 'Clasificación',
                content: clasificacionComponent,
            },
            {
                tab: 'Tipo novedad',
                content: tipoNovedadComponent,
            },
            {
                tab: 'Subregiones',
                content: subRegionComponent,
            }
            ],
        };
    },
};

</script>
