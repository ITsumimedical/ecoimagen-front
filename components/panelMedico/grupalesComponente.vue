<template>
    <div>
        <component :is="comp" :datos="datosGenerales" @cerrar="cerrarHistoria"></component>
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-divider></v-divider>
        <!-- ATENCION OCUPACIONAL -->
        <template>
            <v-row justify="center" dense>
                <v-expansion-panels popout>
                    <v-expansion-panel v-for="(item, i) in agrupadas" :key="i" @click="individualesCitas(item)">
                        <v-expansion-panel-header>{{ item.cita.especialidad.nombre }} - {{ item.cita.nombre }} -
                            {{ item.consultorio.nombre }} - {{ item.fecha_inicio }} Hasta {{ item.fecha_fin
                            }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-col cols="12" sm="6" md="6">
                                <v-spacer></v-spacer>
                                <v-text-field hint="Puede buscar por cualquier columna de la tabla" persistent-hint
                                    v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
                                </v-text-field>
                            </v-col>
                            <v-data-table dense :headers="headers" :items="citas" :items-per-page="5"
                                no-data-text="Aún no hay citas agendadas">
                                <template v-slot:[`item.nombreAfiliado`]="{ item }">
                                    {{
                                        [item.agenda?.afiliados?.[0]?.primer_nombre,
                                        item.agenda?.afiliados?.[0]?.primer_apellido]
                                            .filter(Boolean)
                                            .join(' ') || 'Sin nombre'
                                    }}
                                </template>
                                <template v-slot:[`item.tipoDocumentoAfiliado`]="{ item }">
                                    {{ item.agenda.afiliados[0].tipo_documento }}
                                </template>
                                <template v-slot:[`item.documentoAfiliado`]="{ item }">
                                    {{ item.agenda.afiliados[0].numero_documento }}
                                </template>
                                <template v-slot:[`item.sexoAfiliado`]="{ item }">
                                    {{ item.agenda.afiliados[0].sexo }}
                                </template>
                                <template v-slot:[`item.edadAfiliado`]="{ item }">
                                    {{ item.agenda.afiliados[0].edad_cumplida }}
                                </template>
                                <template v-slot:[`item.sedeAfiliado`]="{ item }">
                                    {{ item.agenda.afiliados[0].ips }}
                                </template>
                                <template v-slot:[`item.especialidad`]="{ item }">
                                    {{ item.agenda.cita.especialidad.nombre }}
                                </template>
                                <template v-slot:[`item.actividad`]="{ item }">
                                    {{ item.agenda.cita.nombre }}
                                </template>
                                <template v-slot:[`item.estado`]="{ item }">
                                    <v-chip small v-if="item.estado_id == 14 || item.estado_id == 13"
                                        :color="getColor(item.estado_id)" dark>
                                        {{ 'Pendiente' }}
                                    </v-chip>
                                    <v-chip small v-if="item.estado_id == 7" :color="getColor(item.estado_id)" dark>
                                        {{ 'En consulta' }}
                                    </v-chip>
                                    <v-chip small v-if="item.estado_id == 8" :color="getColor(item.estado_id)" dark>
                                        {{ 'Inasistido' }}
                                    </v-chip>
                                    <v-chip small v-if="item.estado_id == 9" :color="getColor(item.estado_id)" dark>
                                        {{ 'Atendido' }}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <v-btn color="success" small @click="generarHistoria(item)">Atender</v-btn>
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
        </template>
    </div>
</template>
<script>
import ordenamiento from "~/components/ordenamiento/ordenamiento";
import diagnosticos from "../../components/historia/diagnosticos/diagnosticos"
import antecedentesGlobales from "~/components/historia/antecedentesHistoria/AntecedentesComponent";
import antecedentesPersonales from "~/components/historia/antecedentesHistoria/AntecedentesPersonalesComponent";
import antecedentesFamiliares from "~/components/historia/antecedentesHistoria/AntecedentesFamiliaresComponent";
import HistoriaIntegral from "~/components/panelMedico/historiaIntegral.vue";
export default {
    name: 'atencionMedica',
    components: {
        ordenamiento,
        diagnosticos,
        antecedentesGlobales,
        antecedentesPersonales,
        antecedentesFamiliares,
        HistoriaIntegral
    },
    data() {
        return {
            comp: null,
            model: null,
            preload: false,
            fab: false,
            registroHistoria: {},
            datosGenerales: {},
            tituloHistoria: "",
            e6: 1,
            search: '',
            dialogHistoria: false,
            historia: [],
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Hora',
                sortable: false,
                value: 'fecha_hora_inicio'
            },
            {
                text: 'Paciente',
                sortable: false,
                value: 'nombreAfiliado'
            },
            {
                text: 'Tipo documento',
                sortable: false,
                value: 'afiliado.tipo_documento.nombre'
            },
            {
                text: 'Documento',
                sortable: false,
                value: 'afiliado.numero_documento'
            },
            {
                text: 'Sexo',
                sortable: false,
                value: 'afiliado.sexo',
                align: 'center',
            },
            {
                text: 'Edad',
                sortable: false,
                value: 'afiliado.edad_cumplida',
                align: 'center',
            },
            {
                text: 'Sede',
                sortable: false,
                value: 'agenda.consultorio.rep.nombre'
            },
            {
                text: 'Especialidad',
                sortable: false,
                value: 'agenda.cita.especialidad.nombre'
            },
            {
                text: 'Actividad',
                sortable: false,
                value: 'agenda.cita.nombre'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado',
                align: 'center',
            },
            {
                text: 'Acciones',
                value: 'acciones',
                align: 'center',
            }
            ],
            citas: [],
            agrupadas: [],
        }
    },
    created() {
        this.citasAgrupadas();
    },
    methods: {

        individualesCitas(item) {
            this.preload = true;
            const data = {
                estados: [13, 14, 7],
                id: item.id
            }
            this.$axios.post('/consultas/citasGrupales', data).then(res => {
                this.preload = false;
                this.citas = res.data;
            }).catch(err => {
                this.preload = false;
            })
        },

        citasAgrupadas() {
            this.preload = true;
            this.$axios.post('/consultas/citasAgrupadas').then(res => {
                this.preload = false;
                this.agrupadas = res.data;
            }).catch(err => {
                this.preload = false;
            })
        },

        getColor(estado_id) {
            if (estado_id == 5) return 'blue';
            else if (estado_id == 6) return 'orange'
            else if (estado_id == 7) return 'red'
            else return 'orange'
        },

        async generarHistoria(consulta) {

            try {

                await this.$axios.post(`/consultas/verificar-medico-atiende/${consulta?.id}`)

                this.datosGenerales = consulta;
                this.comp = 'HistoriaIntegral';
                this.individualesCitas(consulta.agenda_id);

            } catch (error) {
                this.$toast.error('Ocurrió un error al generar la historia clínica');
            }

        },
        cerrarHistoria() {
            this.comp = null;
        },

        siguienteCategoria(item, categoria) {
            const validate = this.$refs[categoria][0].validate();
            if (validate) {
                this.e6 = parseInt(item) > this.historia.length ? this.historia.length : item;
            }
        },

        saltoCategoria(actual, siguiente) {
            console.log(actual, siguiente);
        },

        finalizarHistoria() {
            this.preload = true;
            this.$axios.post('/consultas/guardarHistoria/' + this.datosGenerales.id, this.registroHistoria).then(res => {
                this.preload = false;
                this.dialogHistoria = false;
                this.citasAgrupadas();
            }).catch(e => {
                this.preload = false;
                this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: e.response.data.mensaje,
                });
                for (const item in this.$refs) {
                    const validate = this.$refs[item][0].validate();
                    if (!validate) {
                        return this.e6 = item;
                    }
                }
            })
        },

        pausarConsulta() {
            this.dialogHistoria = false;
        },

    },
}

</script>
