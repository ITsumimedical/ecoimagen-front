<template>
    <div>
        <v-col cols="12" md="12" sm="12">
            <v-alert color="info" dense text class="text-center" icon="mdi-pill" border="left" prominent><b>Conciliación
                    medicamentos</b></v-alert>
        </v-col>

        <v-col cols="12" md="12" sm="12">
            <v-alert text dense color="deep-orange" icon="mdi-clock-fast" border="left">
                ¡Atención! este listado de medicamentos es considerado como crónico debido a que han sido ordenados por
                una
                cantidad mayor a 30 días
            </v-alert>
        </v-col>

        <v-col cols="12" md="6" sm="6">
            <v-text-field label="Buscar" v-model="buscar"></v-text-field>
        </v-col>
        <v-data-table :headers="headers" dense :items="medicamentosCronicos" :search="buscar">
            <template v-slot:[`item.user.operador`]="{ item }">
                {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    props: ['datos'],
    data() {
        return {
            headers: [{
                text: 'Codigo Medicamento',
                value: 'codesumi.codigo'
            },
            {
                text: 'Medicamento',
                value: 'codesumi.nombre'
            },
            {
                text: 'Cantidad de meses que se ordenó',
                value: 'meses'
            },
            {
                text: 'Medico que registra',
                value: 'operador'
            }
            ],
            medicamentosCronicos: [],
            buscar: ''
        }
    },

    mounted() {
        this.listarMedicamentosCronicos()
    },
    methods: {
        listarMedicamentosCronicos() {
            this.$axios.post('ordenamiento/HistoricoMedicamentosCronico', {
                consulta_id: this.datos.id
            }).then(res => {
                this.medicamentosCronicos = res.data
            }).catch(error => {
                console.log(error)
            })
        }
    }
}

</script>
