<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Parametrización de Fichas Epidemiológicas</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-tabs v-model="tab" grow show-arrows>
                        <v-tabs-slider color="primary"/>
                        <v-tab key="eventos">
                            <span>Eventos</span>
                        </v-tab>
                        <v-tab key="cabeceras">
                            <span>Cabeceras</span>
                        </v-tab>
                        <v-tab key="campos">
                            <span>Campos</span>
                        </v-tab>
                        <v-tab key="opciones">
                            <span>Opciones</span>
                        </v-tab>
                        <v-tabs-items v-model="tab">
                            <v-tab-item key="eventos">
                                <EventoSivigilaComponent/>
                            </v-tab-item>
                            <v-tab-item key="cabecera">
                                <CabeceraSivigilaComponent/>
                            </v-tab-item>
                            <v-tab-item key="campos">
                                <CampoSivigilaComponent/>
                            </v-tab-item>
                            <v-tab-item key="opciones">
                                <OpcionSivigilaComponent/>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import EventoSivigilaComponent from '@/components/epidemiologia/eventoSivigilaComponent.vue';
import CabeceraSivigilaComponent from '~/components/epidemiologia/cabeceraSivigilaComponent.vue';
import CampoSivigilaComponent from '~/components/epidemiologia/campoSivigilaComponent.vue';
import OpcionSivigilaComponent from '~/components/epidemiologia/opcionSivigilaComponent.vue';

export default {
    components: {
        EventoSivigilaComponent,
        CabeceraSivigilaComponent,
        CampoSivigilaComponent,
        OpcionSivigilaComponent,
    },
    data() {
        return {
            tab: 'eventos'
        }
    },
    mounted() {

    },
    methods: {
        ...mapActions('app', ['setPreload']),
    }
}
</script>
