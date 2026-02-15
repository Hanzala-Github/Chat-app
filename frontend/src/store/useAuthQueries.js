import axios from "../lib/axios";
import toast from "react-hot-toast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { useSocketStore } from "./useSocketStore";

const queryClient = new QueryClient();

const {} = useSocketStore();
