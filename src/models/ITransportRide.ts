export interface ITransportRideType {
    id: number,
    name: string
}

// Ônibus não tem vaga limitada: o formulário esconde o campo de vagas para
// esse tipo, e o backend passa a aceitar totalSpots nulo.
export const BUS_TRANSPORT_TYPE_ID = 3;