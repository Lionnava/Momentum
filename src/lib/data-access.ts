// src/lib/data-access.ts

import type { Task, User, Division, Proposal, Advance } from './types';
import type PocketBase from 'pocketbase';

// Las funciones ya no crean su propio cliente, lo reciben como parámetro.
// Esto evita llamadas redundantes y asegura consistencia.

export async function getTasksForCurrentUser(pb: PocketBase, user: User | null): Promise<Task[]> {
    if (!user) return [];
    try {
        const records = await pb.collection('tasks').getFullList<Task>({ sort: '-created', expand: 'assignee,division,depends_on' });
        return records;
    } catch (error) { return []; }
}

export async function getUsers(pb: PocketBase, user: User | null): Promise<User[]> {
    if (!user) return [];
    try {
        const records = await pb.collection('users').getFullList<User>({ sort: 'name', filter: 'rol != "supermanager"' });
        return records;
    } catch (error) { return []; }
}

export async function getDivisions(pb: PocketBase, user: User | null): Promise<Division[]> {
    if (!user) return [];
    try {
        const records = await pb.collection('divisions').getFullList<Division>({ sort: 'name' });
        return records;
    } catch (error) { return []; }
}

export async function getProposalsForCurrentUser(pb: PocketBase, user: User | null): Promise<Proposal[]> {
    if (!user) return [];
    
    let filter;
    if (user.rol === 'supermanager') {
        filter = `status = "Pendiente superManager"`;
    } else if (user.rol === 'manager') {
        filter = `division.manager.id = "${user.id}" && status = "Pendiente Manager"`;
    } else {
        filter = `proposer.id = "${user.id}"`;
    }
    
    try {
        const records = await pb.collection('proposals').getFullList<Proposal>({ filter, sort: '-created', expand: 'proposer,division' });
        return records;
    } catch (error) { return []; }
}

// ... (y así sucesivamente para las demás funciones como getTaskById, etc.)

export async function getAllTasksForDashboard(pb: PocketBase): Promise<Task[]> {
    try {
        const records = await pb.collection('tasks').getFullList<Task>({ sort: '-created', expand: 'division' });
        return records;
    } catch (error) { return []; }
}