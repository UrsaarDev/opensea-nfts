export interface PopupProps {
    open: boolean
    setOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void
}

export enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
}

export type Login = (connectorId: ConnectorNames) => void;

export interface Config {
    id: number;
    name: string;
    icon: any;
    connectorId: ConnectorNames;
}

export interface CheckboxProps {
    checked: boolean;
    setChecked: any;
}
