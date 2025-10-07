<template>
	<div>
		<v-form ref="EvolucionSignosSintomas" class="mb-5">
			<v-row dense>
				<v-col cols="12" sm="12" md="12">
					<v-alert class="text-center" dense text type="info" icon="mdi-account-file-text-outline"
							 border="left">
						<b>EVOLUCIÓN DE SIGNOS Y SÍNTOMAS</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-menu dense v-model="menu.fecha_inicio" :close-on-content-click="false" :nudge-right="40"
							transition="scale-transition" offset-y min-width="auto">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field dense outlined label="Tiempo de Inicio - Fecha *"
										  v-model="formEvolucion.fecha_inicio"
										  append-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										  :rules="[rules.obligatorio]"></v-text-field>
						</template>
						<v-date-picker v-model="formEvolucion.fecha_inicio"
									   @input="menu.fecha_inicio = false"></v-date-picker>
					</v-menu>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-menu dense v-model="menu.tiempo_inicio" :close-on-content-click="false" :nudge-right="40"
							transition="scale-transition" offset-y min-width="auto">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field dense outlined label="Tiempo de Inicio - Hora *"
										  v-model="formEvolucion.tiempo_inicio"
										  append-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										  :rules="[rules.obligatorio]"></v-text-field>
						</template>
						<v-time-picker v-model="formEvolucion.tiempo_inicio" format="24hr" scrollable no-title
									   @input="menu.tiempo_inicio = false"></v-time-picker>
					</v-menu>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea dense outlined auto-grow label="Signos y Síntomas Principales *"
								:rules="[rules.obligatorio,rules.minCaracteres]"
								v-model="formEvolucion.signos_sintomas"></v-textarea>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea dense outlined auto-grow
								label="Estresores Importantes (Que guardan relación con el problema del paciente, con las causas que desencadenan conductas inapropiadas o que agraven el problema) *"
								:rules="[rules.obligatorio,rules.minCaracteres]"
								v-model="formEvolucion.estresores_importantes"></v-textarea>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea dense outlined auto-grow
								label="Estado Actual *"
								:rules="[rules.obligatorio,rules.minCaracteres]"
								v-model="formEvolucion.estado_actual"></v-textarea>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea dense outlined auto-grow
								label="Profesionales con los que ha consultado anteriormente *"
								:rules="[rules.obligatorio,rules.minCaracteres]"
								v-model="formEvolucion.profesional_consultado_antes"></v-textarea>
				</v-col>
			</v-row>
		</v-form>
		<tratamiento-farmacologico :datos="datos"/>
	</div>
</template>

<script>
import TratamientoFarmacologico from "~/components/historia/formularios/tratamientoFarmacologico.vue";
import {mapActions,mapGetters} from "vuex";

export default {
	components: {TratamientoFarmacologico},
	props: ['datos'],
	data() {
		return {
			menu: {
				fecha_inicio: false,
				tiempo_inicio: false,
			},
			formEvolucion: {
				fecha_inicio: '',
				tiempo_inicio: '',
				signos_sintomas: '',
				estresores_importantes: '',
				estado_actual: '',
				profesional_consultado_antes: '',
			},
			rules: {
				obligatorio: v => !!v || "Este campo es obligatorio.",
                minCaracteres: v => (v && v.length >= 5) || 'Este campo debe tener al menos 5 caracteres.',
			},
		}
	},
	mounted() {
        const datosEvolucion = this.obtenerDatosPorConsulta(this.datos.id, 'EvolucionSignosSintomas/Models/EvolucionSignosSintomas', 'historia/formularios/evolucionSignosSintomas');

        if (datosEvolucion) {
            this.formEvolucion = { ...datosEvolucion }
        } else {
            this.listarUltimaEvolucionRegistrada();
        }
	},
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
	methods: {
		...mapActions("app", ["setPreload"]),

        obtenerDatos() {
            const data = {
				...this.formEvolucion,
            }
                return {
                    datos: data
                };
            },

		async listarUltimaEvolucionRegistrada() {
			try {
				this.setPreload(true);

				const response = await this.$axios.get(`/evolucion-signos-sintomas/listar-ultima-evolucion/${this.datos.afiliado_id}`);

				this.formEvolucion = response.data;
			} catch (error) {
				this.$toast.error('Ocurrio un error al listar el último registro de evolución signos y síntomas.');
			} finally {
				this.setPreload(false);
			}
		}
	}
}
</script>
