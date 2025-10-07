<template>
    <v-row dense>
        <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="params.fechaInicial" label="Fecha Inicial" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="params.fechaFinal" label="Fecha Final" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <v-autocomplete v-model="params.rep" label="Punto de atencion" outlined dense
                :items="reps"></v-autocomplete>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            params: {
                fechaInicial: null,
                fechaFinal: null,
                rep: null,
            },
            reps: [
                "CLINICA VICTORIANA",
                "FERROCARRILES BELLO",
                "FERROCARRILES MEDELLIN",
                "SEDE SUMIMEDICAL ITAGUI",
                "SUMIMEDICAL COPACABANA",
                "SUMIMEDICAL ISTMINA",
                "SUMIMEDICAL QUIBDO",
                "SUMIMEDICAL RIONEGRO",
                "SUMIMEDICAL SAS BELLO",
                "SUMIMEDICAL SEDE APARTADO",
                "SUMIMEDICAL SEDE APOYO TERAPEUTICO",
                "SUMIMEDICAL SEDE BUCARAMANGA",
                "SUMIMEDICAL SEDE CALDAS",
                "SUMIMEDICAL SEDE CAUCASIA",
                "SUMIMEDICAL SEDE CHIGORODO",
                "SUMIMEDICAL SEDE ENVIGADO",
                "SUMIMEDICAL SEDE ESTADIO",
                "SUMIMEDICAL SEDE NECOCLI",
                "SUMIMEDICAL SEDE ORIENTAL",
                "SUMIMEDICAL SEDE PUERTO BERRIO",
                "SUMIMEDICAL SEDE TURBO",
                "SUMIMEDICAL SEDE VILLANUEVA",
                "TORRE INTERMEDICA"
            ],
        };
    },
    watch: {
        params: {
            handler(newVal) {
                this.$emit("update-params", newVal);
            },
            deep: true,
        },
    },
};
</script>