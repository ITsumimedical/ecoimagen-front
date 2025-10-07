<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px"/>
                            <span>Citas</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-tabs v-model="tab" grow @change="onTabChanged">
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab key="agendarCitaAutogestion"> AGENDAMIENTO DE CITAS</v-tab>
                    <v-tab key="registroCitasAutogestion"> REGISTRO DE CITAS</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="agendarCitaAutogestion" class="my-2 mx-2">
                        <agendarCitaAutogestion/>
                    </v-tab-item>
                    <v-tab-item key="registroCitasAutogestion" class="my-2 mx-2">
                        <registroCitasAutogestion ref="registroCitasAutogestion"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import agendarCitaAutogestion from "~/components/autogestion/agendarCitaAutogestion.vue";
import registroCitasAutogestion from "~/components/autogestion/registroCitasAutogestion.vue";

export default {
    components: {
        agendarCitaAutogestion,
        registroCitasAutogestion,
    },
    data() {
        return {
            tab: "agendarCitaAutogestion",
        };
    },
    methods: {
        onTabChanged(tab) {
            switch (tab) {
                case 1:
                    if (this.$refs.registroCitasAutogestion) {
                        this.$refs.registroCitasAutogestion.buscarAfiliado();
                    }
                    break;
                default:
                    console.log('Tab no encontrado');
                    break;
            }
        }
    }
};
</script>
