<template>
    <v-card>
        <v-toolbar flat>
            <v-toolbar-title>
                <div class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                    <span>Demanda inducida</span>
                </div>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-tabs grow>
            <v-tab @click="tabActivo('demandaInducida')">
                DEMANDA INDUCIDA
            </v-tab>
            <v-tab @click="tabActivo('administracion')" :disabled="!$can('admin_demanda_inducida.ver')">
                ADMIN DEMANDA INDUCIDA
            </v-tab>

            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <demandaInducidaComponent :ejecutar="demandaInducida" />
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <admin :ejecutar="administracion" />
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script>
import demandaInducidaComponent from '~/components/demandaInducida/demandaInducidaComponente.vue'
import admin from '~/components/demandaInducida/administracionDemandaInducida.vue'

export default {
    components: {
        demandaInducidaComponent,
        admin
    },
    data() {
        return {
            demandaInducida: true,
            administracion: false,
        };
    },
    methods: {
        tabActivo(tab) {
            this.demandaInducida = tab === 'demandaInducida';
            this.administracion = tab === 'administracion';
        }
    }

};

</script>
