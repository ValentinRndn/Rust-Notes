// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn get_message() -> String {
 "Hello from Rust!".to_string()
}


#[derive(Serialize, Deserialize)]
struct Note {
    titre: String,
    contenu: String,
}

#[tauri::command]
fn save_note(note: Note) {
    let mut file = File::create("notes.json").expect("La création du fichier a échoué");
    let note_json = serde_json::to_string(&note).expect("La sérialisation JSON a échoué");
    file.write_all(note_json.as_bytes()).expect("L'écriture dans le fichier a échoué");
}

//Lire les notes depuis le fichier json
fn read_notes() -> Vec<Note> {
    let file = File::open("notes.json").expect("L'ouverture du fichier a échoué");
    let notes: Vec<Note> = serde_json::from_reader(file).expect("La désérialisation JSON a échoué");
    notes
}
 
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, save_note])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

