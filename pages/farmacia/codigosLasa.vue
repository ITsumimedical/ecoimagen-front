<template>
    <div>
        <v-card>
            <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>PARAMETRIZACIÓN DE
                    CÓDIGOS LASA</b></v-alert>
            <v-container>
                <v-row>

                    <v-col cols="12" sm="12" md="8">
                        <table class="tg">
                            <thead>
                                <tr>
                                    <th class="tg-xphl">
                                        <v-icon color="blue">
                                            mdi-pill
                                        </v-icon>
                                    </th>
                                    <th class="tg-xphl"><span style="font-weight:bold">Rótulo Azul</span></th>
                                    <th class="tg-m8e4"><span style="color:#333">Medicamentos con apariencia
                                            similar</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="tg-xphl">
                                        <v-icon color="yellow">
                                            mdi-pill
                                        </v-icon>
                                    </td>
                                    <td class="tg-xphl"><span style="font-weight:bold">Rótulo Amarillo</span></td>
                                    <td class="tg-m8e4"><span
                                            style="font-weight:400;font-style:normal;color:#333">Medicamentos con
                                            fonética y
                                            ortografía similar</span></td>
                                </tr>
                                <tr>
                                    <td class="tg-xphl">
                                        <v-icon color="green">
                                            mdi-pill
                                        </v-icon>
                                    </td>
                                    <td class="tg-xphl"><span style="font-weight:bold">Rótulo Verde</span></td>
                                    <td class="tg-m8e4"><span style="color:#333">Medicamentos con similar principio
                                            activo, pero de varias
                                            concentraciones.</span></td>
                                </tr>
                                <tr>
                                    <td class="tg-xphl">
                                        <v-icon color="orange">
                                            mdi-pill
                                        </v-icon>
                                    </td>
                                    <td class="tg-xphl"><span style="font-weight:bold">Rótulo Naranja</span></td>
                                    <td class="tg-m8e4">Medicamentos de máxima alerta o <span
                                            style="font-weight:bold;color:#FE996B;background-color:#FFF">ALTO
                                            RIESGO</span><span style="color:#FE996B;background-color:#FFF">.</span><span
                                            style="color:#FE996B"> </span>por su
                                        naturaleza pueden causar la muerte de un paciente en el caso de una
                                        equivocación.</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col cols="12" sm="12" md="4" class="mt-15">
                        <v-col v-for="med in medPendientesLasa" :key="med.color" cols="12" sm="12" md="12">
                            <Widget :color="med.color" :icon="med.icon" :title="med.title" :subTitle="med.subTitle"
                                :supTitle="med.supTitle" />
                        </v-col>
                    </v-col>
                </v-row>
            </v-container>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="12" md="8">
                        <v-autocomplete v-model="formMedicamento.codesumi_id" outlined dense :items="medicamentos"
                            item-value="codesumi_id" item-text="nombre" :search-input.sync="medicamento"
                            label="Buscar medicamento por nombre o código">
                            <template v-slot:item="{ item }">
                                <v-row>
                                    <v-col>
                                        {{ item.nombre }}
                                    </v-col>
                                    <v-col v-if="item.icon" cols="auto">
                                        <v-icon :color="item.color">{{ item.icon }}</v-icon>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="formMedicamento.codigo_lasa" outlined dense :items="color"
                            item-text="nombre" return-object label="Código lasa"></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="12" md="2">
                        <v-btn tile color="success" @click="marcarMedicamento()">
                            <v-icon left>
                                mdi-content-save-all
                            </v-icon>
                            Marcar
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-card-title>
                            <v-badge bordered color="success" :content="cantidadMedicamentosMarcados" overlap>
                                <v-btn class="white--text" color="teal lighten-3" depressed>
                                    Medicamentos Marcados
                                </v-btn>
                            </v-badge>
                            <v-spacer></v-spacer>
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar medicamento"
                                single-line hide-details></v-text-field>
                        </v-card-title>
                        <v-data-table :headers="headers" :items="medicamentosMarcados" :search="search">
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-row>
                                    <v-col>
                                        {{ item.nombre }}
                                        <v-icon large :color="getColor(item.codigo_lasa)">
                                            mdi-pill
                                        </v-icon>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex";

export default {
    name: 'FrontHorusCodigosLasa',

    data() {
        return {
            medicamentosMarcados: [],
            cantidadMedicamentosMarcados: null,
            search: null,
            medicamentos: null,
            medicamento: null,
            formMedicamento: {
                codesumi_id: null,
                codigo_lasa: ''
            },
            color: ['Azul', 'Amarillo', 'Verde', 'Naranja'],
            medPendientesLasa: [{
                color: '#3b86b1',
                icon: 'mdi-pill',
                title: '0',
                subTitle: 'Medicamentos sin código lasa',
            },],
            headers: [
                {
                    text: 'Medicamento',
                    align: 'start',
                    sortable: false,
                    value: 'nombre',
                },
                { text: 'Tipo', value: 'tipo_codesumi' },
                { text: 'Codigo', value: 'codigo' },
                { text: 'Codigo lasa', value: 'codigo_lasa' },
                { text: 'Codigo lasa', value: 'acciones' },
            ],
        };
    },
    watch: {
        medicamento(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarMedicamentos();
                } else if (val.length < 4) {
                    this.medicamentos = null;
                }
            } else {
                this.medicamentos = null;

            }
        }
    },

    created() {
        this.contador();
        this.listarMedicamentosMarcados();
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        contador() {
            this.$axios.get('/medicamentos/contador').then(res => {
                this.medPendientesLasa[0].title = (res.data).toString();
            })
        },

        async listarMedicamentos() {

            try {
                const res = await this.$axios.post('/medicamentos/listarVademecum', { nombre: this.medicamento })
                this.medicamentos = res.data.map((med) => {
                    return {
                        id: med.id,
                        nombre: med.invima ? `${med.codesumi.nombre} - ${med.codesumi.codigo} - ${med.invima.titular} - ${med.codigo_lasa}` : `${med.codesumi.nombre} - ${med.codesumi.codigo} - 'sin titular' - ${med.codigo_lasa}`,
                        codesumi_id: med.codesumi_id
                    }
                })
            } catch (error) {
                this.$toast.error('Ha ocurrido un error al buscar los medicamentos')
            }

        },

        async marcarMedicamento() {
            try {
                this.setPreload(true)
                await this.$axios.post('/medicamentos/marcarMedicamento', this.formMedicamento);
                this.$toast.success('Medicamentos marcados con Exito')

            } catch (error) {
                this.$toast.error('Ha ocurrido un error al marcar el medicamento');
            } finally {
                this.contador();
                this.limpiarForm()
                this.setPreload(false)
            }

        },
        
        limpiarForm() {
            for (const key in this.formMedicamento) {
                this.formMedicamento[key] = ''
            }
        },

        async listarMedicamentosMarcados() {

            try {
                const res = await this.$axios.post('/medicamentos/medicamentosMarcados');
                this.medicamentosMarcados = res.data;
                this.cantidadMedicamentosMarcados = res.data.length
            } catch (error) {
                this.$toast.error('ha ocurrido un error al buscar los medicamentos marcados')
            }
        },

        getColor(codigoLasa) {
            const colorMap = {
                Azul: 'blue',
                Naranja: 'orange',
                Verde: 'green',
                Amarillo: 'yellow',
            };
            return colorMap[codigoLasa] || 'grey';
        },
    },
};

</script>

<style lang="scss" scoped>
.tg {
    border-collapse: collapse;
    border-spacing: 0;
}

.tg td {
    border-color: black;
    border-style: solid;
    border-width: 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
}

.tg th {
    border-color: black;
    border-style: solid;
    border-width: 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
}

.tg .tg-m8e4 {
    background-color: #ffffff;
    border-color: #dae8fc;
    text-align: left;
    vertical-align: top
}

.tg .tg-xphl {
    border-color: #dae8fc;
    text-align: left;
    vertical-align: top
}
</style>
