<template>
	<div>
		<v-card-title class="pa-0">
			<v-toolbar flat dense>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="Logo evento adverso" height="40" width="40" class="mr-2" />
						<span class="font-weight-bold text-subtitle-1">
							Proceso de devolución de evento adverso
						</span>
					</div>
				</v-toolbar-title>

				<v-divider class="mx-4" inset vertical></v-divider>
			</v-toolbar>
		</v-card-title>

		<v-container>
			<v-row>
				<v-col cols="12">
					<v-textarea v-model="gestionEvento.motivo_devolucion" outlined dense auto-grow
						label="Motivo de devolución" :rules="[requerido]" clearable
						prepend-inner-icon="mdi-comment-alert-outline" />
				</v-col>
			</v-row>
		</v-container>

		<v-card-actions>
			<v-spacer />

			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn small color="info" dark class="mr-3" v-bind="attrs" v-on="on"
						@click="reasignarEvento" aria-label="Devolver evento adverso">
						<v-icon left dark>mdi-hand-pointing-right</v-icon>
						Devolver
					</v-btn>
				</template>
				<span>Devolver evento al responsable</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn small color="red darken-1" dark v-bind="attrs" v-on="on"
						@click="cerrar" aria-label="Cerrar diálogo">
						<v-icon left>mdi-close</v-icon>
						Cerrar
					</v-btn>
				</template>
				<span>Cerrar ventana sin guardar</span>
			</v-tooltip>
		</v-card-actions>
	</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: "WorkspaceJsonReasignarEventoComponente",

	props: {
		eventoAdverso: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			requerido: (v) => !!v || "Este campo es requerido",
			gestionEvento: {
				motivo_devolucion: "",
			},
			listaEmpleados: [],
			errors: {
				empleado_asignado: "",
			},
			empleado_asignado: [],
		};
	},

	mounted() {
		this.listarEmpleados();
	},

	methods: {
		...mapActions("app", ["setPreload"]),

		async reasignarEvento() {
			if (!this.gestionEvento.motivo_devolucion) {
				this.$swal({
					title: "¡Falta información!",
					text: "Es necesario que diligencie un motivo de devolución.",
					type: "warning",
					confirmButtonText: "Aceptar",
				});
				return; // detener flujo si no hay motivo
			}

			try {
				this.setPreload(true);

				await this.$axios.post("eventos-adversos/devolverEvento", {
					evento_adverso_id: this.eventoAdverso.id,
					motivo_devolucion: this.gestionEvento.motivo_devolucion,
				});

				this.$toast.success("Se ha devuelto el evento con éxito");
				this.$emit("devuelto");
				this.cerrar();
			} catch (error) {
				console.error(error);
				this.$toast.error("Ocurrió un error al devolver el evento");
			} finally {
				this.setPreload(false);
			}
		},

		async listarEmpleados() {
			try {
				const res = await this.$axios.get("/operador/listarActivos");
				this.listaEmpleados = res.data.map((empleado) => ({
					id: empleado.user_id,
					nombre: `${empleado.documento} - ${empleado.nombre}`,
				}));
			} catch (error) {
				this.$toast.error(error.response?.data?.mensaje || "Error al listar empleados");
			}
		},

		ErrorEntrada(errors) {
			for (const key in this.errors) {
				this.errors[key] = errors[key]?.join(",") || "";
			}
		},

		limpiarError() {
			Object.keys(this.errors).forEach((key) => {
				this.errors[key] = "";
			});
		},

		cerrar() {
			this.gestionEvento = {
				motivo_devolucion: "",
			};
			this.$emit("cerrarDialog");
		},
	},
};
</script>
