const { TezosToolkit,MichelsonMap,OpKind} = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');
const fs= require('fs');
const { networkInterfaces } = require('os');

const rpc = "https://granadanet.smartpy.io/";
// const signer = new InMemorySigner("edsk2tqKjthxv9LYqxZQrCBD9F5AJHEaYtGxL874i9NSjtrZkrrWBd")

const Tezos = new TezosToolkit(rpc);

function println(x){
    console.log(x)
}

// type storage is record [
//   pendings    : big_map(nat, proposal);
//   managers    : set(address);
//   id_count    : nat;
//   required    : nat;
// ]
const code=[ { "prim": "parameter",
"args":
  [ { "prim": "or",
      "args":
        [ { "prim": "or",
            "args":
              [ { "prim": "or",
                  "args":
                    [ { "prim": "nat", "annots": [ "%approve" ] },
                      { "prim": "pair",
                        "args":
                          [ { "prim": "bool", "annots": [ "%allowed" ] },
                            { "prim": "address",
                              "annots": [ "%manager" ] } ],
                        "annots": [ "%control" ] } ] },
                { "prim": "or",
                  "args":
                    [ { "prim": "unit", "annots": [ "%default" ] },
                      { "prim": "nat", "annots": [ "%execute" ] } ] } ] },
          { "prim": "or",
            "args":
              [ { "prim": "pair",
                  "args":
                    [ { "prim": "pair",
                        "args":
                          [ { "prim": "lambda",
                              "args":
                                [ { "prim": "unit" },
                                  { "prim": "list",
                                    "args": [ { "prim": "operation" } ] } ],
                              "annots": [ "%actions" ] },
                            { "prim": "bool", "annots": [ "%approve" ] } ] },
                      { "prim": "nat", "annots": [ "%expired" ] } ],
                  "annots": [ "%propose" ] },
                { "prim": "nat", "annots": [ "%require" ] } ] } ] } ] },
{ "prim": "storage",
"args":
  [ { "prim": "pair",
      "args":
        [ { "prim": "pair",
            "args":
              [ { "prim": "nat", "annots": [ "%id_count" ] },
                { "prim": "set", "args": [ { "prim": "address" } ],
                  "annots": [ "%managers" ] } ] },
          { "prim": "pair",
            "args":
              [ { "prim": "big_map",
                  "args":
                    [ { "prim": "nat" },
                      { "prim": "pair",
                        "args":
                          [ { "prim": "pair",
                              "args":
                                [ { "prim": "lambda",
                                    "args":
                                      [ { "prim": "unit" },
                                        { "prim": "list",
                                          "args":
                                            [ { "prim": "operation" } ] } ],
                                    "annots": [ "%actions" ] },
                                  { "prim": "set",
                                    "args": [ { "prim": "address" } ],
                                    "annots": [ "%approve" ] } ] },
                            { "prim": "timestamp",
                              "annots": [ "%expired" ] } ] } ],
                  "annots": [ "%pendings" ] },
                { "prim": "nat", "annots": [ "%required" ] } ] } ] } ] },
{ "prim": "code",
"args":
  [ [ { "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" },
      { "prim": "CAR" },
      { "prim": "IF_LEFT",
        "args":
          [ [ { "prim": "IF_LEFT",
                "args":
                  [ [ { "prim": "IF_LEFT",
                        "args":
                          [ [ { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" }, { "prim": "CDR" },
                              { "prim": "SENDER" }, { "prim": "MEM" },
                              { "prim": "IF",
                                "args":
                                  [ [],
                                    [ { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/not-permitted" } ] },
                                      { "prim": "FAILWITH" } ] ] },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CDR" }, { "prim": "CAR" },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "GET" },
                              { "prim": "IF_NONE",
                                "args":
                                  [ [ { "prim": "DROP" },
                                      { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/no-proposal" } ] },
                                      { "prim": "FAILWITH" } ],
                                    [ { "prim": "NOW" },
                                      { "prim": "SWAP" },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "COMPARE" },
                                      { "prim": "LT" },
                                      { "prim": "IF",
                                        "args":
                                          [ [ { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "CDR" },
                                              { "prim": "CDR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "4" } ] },
                                              { "prim": "CDR" },
                                              { "prim": "CAR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "NONE",
                                                "args":
                                                  [ { "prim": "pair",
                                                      "args":
                                                        [ { "prim":
                                                              "pair",
                                                            "args":
                                                              [ { "prim":
                                                                "lambda",
                                                                "args":
                                                                [ { "prim":
                                                                "unit" },
                                                                { "prim":
                                                                "list",
                                                                "args":
                                                                [ { "prim":
                                                                "operation" } ] } ] },
                                                                { "prim":
                                                                "set",
                                                                "args":
                                                                [ { "prim":
                                                                "address" } ] } ] },
                                                          { "prim":
                                                              "timestamp" } ] } ] },
                                              { "prim": "SWAP" },
                                              { "prim": "UPDATE" },
                                              { "prim": "PAIR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "CAR" },
                                              { "prim": "PAIR" },
                                              { "prim": "SWAP" },
                                              { "prim": "PAIR" } ],
                                            [ { "prim": "DUP" },
                                              { "prim": "CAR" },
                                              { "prim": "CDR" },
                                              { "prim": "SENDER" },
                                              { "prim": "MEM" },
                                              { "prim": "IF",
                                                "args":
                                                  [ [ { "prim": "PUSH",
                                                        "args":
                                                          [ { "prim":
                                                                "string" },
                                                            { "string":
                                                                "Multisig/approved" } ] },
                                                      { "prim":
                                                          "FAILWITH" } ],
                                                    [] ] },
                                              { "prim": "DUP" },
                                              { "prim": "CDR" },
                                              { "prim": "SWAP" },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "CAR" },
                                              { "prim": "CDR" },
                                              { "prim": "PUSH",
                                                "args":
                                                  [ { "prim": "bool" },
                                                    { "prim": "True" } ] },
                                              { "prim": "SENDER" },
                                              { "prim": "UPDATE" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "CAR" },
                                              { "prim": "CAR" },
                                              { "prim": "PAIR" },
                                              { "prim": "PAIR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "CDR" },
                                              { "prim": "CDR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "4" } ] },
                                              { "prim": "CDR" },
                                              { "prim": "CAR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "4" } ] },
                                              { "prim": "SWAP" },
                                              { "prim": "SOME" },
                                              { "prim": "SWAP" },
                                              { "prim": "UPDATE" },
                                              { "prim": "PAIR" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "CAR" },
                                              { "prim": "PAIR" },
                                              { "prim": "SWAP" },
                                              { "prim": "PAIR" } ] ] },
                                      { "prim": "CDR" } ] ] },
                              { "prim": "NIL",
                                "args": [ { "prim": "operation" } ] },
                              { "prim": "PAIR" } ],
                            [ { "prim": "SELF" }, { "prim": "ADDRESS" },
                              { "prim": "SENDER" },
                              { "prim": "COMPARE" }, { "prim": "EQ" },
                              { "prim": "IF",
                                "args":
                                  [ [],
                                    [ { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/not-permitted" } ] },
                                      { "prim": "FAILWITH" } ] ] },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" }, { "prim": "CDR" },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CDR" }, { "prim": "MEM" },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" }, { "prim": "COMPARE" },
                              { "prim": "NEQ" },
                              { "prim": "IF",
                                "args":
                                  [ [],
                                    [ { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/invalid-admin" } ] },
                                      { "prim": "FAILWITH" } ] ] },
                              { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CDR" }, { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" },
                              { "prim": "IF",
                                "args":
                                  [ [ { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "3" } ] },
                                      { "prim": "CAR" },
                                      { "prim": "CDR" },
                                      { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "bool" },
                                            { "prim": "True" } ] },
                                      { "prim": "SWAP" },
                                      { "prim": "UPDATE" } ],
                                    [ { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "3" } ] },
                                      { "prim": "CAR" },
                                      { "prim": "CDR" },
                                      { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "bool" },
                                            { "prim": "False" } ] },
                                      { "prim": "SWAP" },
                                      { "prim": "UPDATE" } ] ] },
                              { "prim": "DIG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" }, { "prim": "CAR" },
                              { "prim": "PAIR" }, { "prim": "PAIR" },
                              { "prim": "NIL",
                                "args": [ { "prim": "operation" } ] },
                              { "prim": "PAIR" } ] ] } ],
                    [ { "prim": "IF_LEFT",
                        "args":
                          [ [ { "prim": "DROP" },
                              { "prim": "NIL",
                                "args": [ { "prim": "operation" } ] },
                              { "prim": "PAIR" } ],
                            [ { "prim": "SWAP" }, { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "CAR" }, { "prim": "CDR" },
                              { "prim": "SENDER" }, { "prim": "MEM" },
                              { "prim": "IF",
                                "args":
                                  [ [],
                                    [ { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/not-permitted" } ] },
                                      { "prim": "FAILWITH" } ] ] },
                              { "prim": "NIL",
                                "args": [ { "prim": "operation" } ] },
                              { "prim": "DIG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "3" } ] },
                              { "prim": "CDR" }, { "prim": "CAR" },
                              { "prim": "DIG",
                                "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG",
                                "args": [ { "int": "3" } ] },
                              { "prim": "GET" },
                              { "prim": "IF_NONE",
                                "args":
                                  [ [ { "prim": "SWAP" },
                                      { "prim": "DROP" },
                                      { "prim": "PUSH",
                                        "args":
                                          [ { "prim": "string" },
                                            { "string":
                                                "Multisig/no-proposal" } ] },
                                      { "prim": "FAILWITH" } ],
                                    [ { "prim": "NOW" },
                                      { "prim": "SWAP" },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "COMPARE" },
                                      { "prim": "LT" },
                                      { "prim": "IF",
                                        "args":
                                          [ [ { "prim": "DROP" } ],
                                            [ { "prim": "SWAP" },
                                              { "prim": "DROP" },
                                              { "prim": "DIG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "3" } ] },
                                              { "prim": "CDR" },
                                              { "prim": "CDR" },
                                              { "prim": "SWAP" },
                                              { "prim": "DUP" },
                                              { "prim": "DUG",
                                                "args":
                                                  [ { "int": "2" } ] },
                                              { "prim": "CAR" },
                                              { "prim": "CDR" },
                                              { "prim": "SIZE" },
                                              { "prim": "COMPARE" },
                                              { "prim": "LT" },
                                              { "prim": "IF",
                                                "args":
                                                  [ [ { "prim": "PUSH",
                                                        "args":
                                                          [ { "prim":
                                                                "string" },
                                                            { "string":
                                                                "Multisig/not-approved" } ] },
                                                      { "prim":
                                                          "FAILWITH" } ],
                                                    [] ] },
                                              { "prim": "PUSH",
                                                "args":
                                                  [ { "prim": "unit" },
                                                    { "prim": "Unit" } ] },
                                              { "prim": "SWAP" },
                                              { "prim": "CAR" },
                                              { "prim": "CAR" },
                                              { "prim": "SWAP" },
                                              { "prim": "EXEC" } ] ] },
                                      { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "3" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "CDR" },
                                      { "prim": "DIG",
                                        "args": [ { "int": "3" } ] },
                                      { "prim": "DUP" },
                                      { "prim": "DUG",
                                        "args": [ { "int": "4" } ] },
                                      { "prim": "CDR" },
                                      { "prim": "CAR" },
                                      { "prim": "DIG",
                                        "args": [ { "int": "3" } ] },
                                      { "prim": "NONE",
                                        "args":
                                          [ { "prim": "pair",
                                              "args":
                                                [ { "prim": "pair",
                                                    "args":
                                                      [ { "prim":
                                                            "lambda",
                                                          "args":
                                                            [ { "prim":
                                                                "unit" },
                                                              { "prim":
                                                                "list",
                                                                "args":
                                                                [ { "prim":
                                                                "operation" } ] } ] },
                                                        { "prim": "set",
                                                          "args":
                                                            [ { "prim":
                                                                "address" } ] } ] },
                                                  { "prim": "timestamp" } ] } ] },
                                      { "prim": "SWAP" },
                                      { "prim": "UPDATE" },
                                      { "prim": "PAIR" },
                                      { "prim": "DIG",
                                        "args": [ { "int": "2" } ] },
                                      { "prim": "CAR" },
                                      { "prim": "PAIR" },
                                      { "prim": "SWAP" },
                                      { "prim": "PAIR" } ] ] } ] ] } ] ] } ],
            [ { "prim": "IF_LEFT",
                "args":
                  [ [ { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" }, { "prim": "CDR" },
                      { "prim": "SENDER" }, { "prim": "MEM" },
                      { "prim": "IF",
                        "args":
                          [ [],
                            [ { "prim": "PUSH",
                                "args":
                                  [ { "prim": "string" },
                                    { "string": "Multisig/not-permitted" } ] },
                              { "prim": "FAILWITH" } ] ] },
                      { "prim": "PUSH",
                        "args": [ { "prim": "nat" }, { "int": "3600" } ] },
                      { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CDR" }, { "prim": "COMPARE" },
                      { "prim": "GE" },
                      { "prim": "PUSH",
                        "args":
                          [ { "prim": "nat" }, { "int": "15552000" } ] },
                      { "prim": "DIG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "3" } ] },
                      { "prim": "CDR" }, { "prim": "COMPARE" },
                      { "prim": "LE" }, { "prim": "AND" },
                      { "prim": "IF",
                        "args":
                          [ [],
                            [ { "prim": "PUSH",
                                "args":
                                  [ { "prim": "string" },
                                    { "string": "Multisig/wrong-duration" } ] },
                              { "prim": "FAILWITH" } ] ] },
                      { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CDR" }, { "prim": "CDR" },
                      { "prim": "DIG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "3" } ] },
                      { "prim": "CDR" }, { "prim": "CAR" },
                      { "prim": "DIG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "3" } ] },
                      { "prim": "CDR" }, { "prim": "INT" },
                      { "prim": "NOW" }, { "prim": "ADD" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" }, { "prim": "CDR" },
                      { "prim": "IF",
                        "args":
                          [ [ { "prim": "EMPTY_SET",
                                "args": [ { "prim": "address" } ] },
                              { "prim": "PUSH",
                                "args":
                                  [ { "prim": "bool" },
                                    { "prim": "True" } ] },
                              { "prim": "SENDER" },
                              { "prim": "UPDATE" } ],
                            [ { "prim": "EMPTY_SET",
                                "args": [ { "prim": "address" } ] } ] ] },
                      { "prim": "DIG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" }, { "prim": "CAR" },
                      { "prim": "PAIR" }, { "prim": "PAIR" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" }, { "prim": "CAR" },
                      { "prim": "SWAP" }, { "prim": "SOME" },
                      { "prim": "SWAP" }, { "prim": "UPDATE" },
                      { "prim": "PAIR" }, { "prim": "SWAP" },
                      { "prim": "CAR" }, { "prim": "PAIR" },
                      { "prim": "DUP" }, { "prim": "CDR" },
                      { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" }, { "prim": "CDR" },
                      { "prim": "PUSH",
                        "args": [ { "prim": "nat" }, { "int": "1" } ] },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "CAR" }, { "prim": "CAR" },
                      { "prim": "ADD" }, { "prim": "PAIR" },
                      { "prim": "PAIR" },
                      { "prim": "NIL",
                        "args": [ { "prim": "operation" } ] },
                      { "prim": "PAIR" } ],
                    [ { "prim": "SELF" }, { "prim": "ADDRESS" },
                      { "prim": "SENDER" }, { "prim": "COMPARE" },
                      { "prim": "EQ" },
                      { "prim": "IF",
                        "args":
                          [ [],
                            [ { "prim": "PUSH",
                                "args":
                                  [ { "prim": "string" },
                                    { "string": "Multisig/not-permitted" } ] },
                              { "prim": "FAILWITH" } ] ] },
                      { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" }, { "prim": "CDR" },
                      { "prim": "SIZE" }, { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "COMPARE" }, { "prim": "LE" },
                      { "prim": "PUSH",
                        "args": [ { "prim": "nat" }, { "int": "0" } ] },
                      { "prim": "DIG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "3" } ] },
                      { "prim": "COMPARE" }, { "prim": "GT" },
                      { "prim": "AND" },
                      { "prim": "IF",
                        "args":
                          [ [],
                            [ { "prim": "PUSH",
                                "args":
                                  [ { "prim": "string" },
                                    { "string":
                                        "Multisig/invalid-require" } ] },
                              { "prim": "FAILWITH" } ] ] },
                      { "prim": "SWAP" }, { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CDR" }, { "prim": "CAR" },
                      { "prim": "PAIR" }, { "prim": "SWAP" },
                      { "prim": "CAR" }, { "prim": "PAIR" },
                      { "prim": "NIL",
                        "args": [ { "prim": "operation" } ] },
                      { "prim": "PAIR" } ] ] } ] ] } ] ] } ]

function getTransferMultsig(add,value,expired){

let transfer={ "prim": "Right",
"args":
  [ { "prim": "Left",
      "args":
        [ { "prim": "Pair",
            "args":
              [ { "prim": "Pair",
                  "args":
                    [ [ { "prim": "DROP" },
                        { "prim": "NIL",
                          "args": [ { "prim": "operation" } ] },
                        { "prim": "PUSH",
                          "args":
                            [ { "prim": "address" },
                              { "string":
                                  "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" } ] },
                        { "prim": "CONTRACT",
                          "args": [ { "prim": "unit" } ] },
                        { "prim": "IF_NONE",
                          "args":
                            [ [ { "prim": "PUSH",
                                  "args":
                                    [ { "prim": "string" },
                                      { "string":
                                          "bad address for get_contract" } ] },
                                { "prim": "FAILWITH" } ], [] ] },
                        { "prim": "PUSH",
                          "args":
                            [ { "prim": "mutez" }, { "int": "1000000" } ] },
                        { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
                        { "prim": "CONS" } ], { "prim": "True" } ] },
                { "int": "2000" } ] } ] } ] }
// println(transfer)

transfer.args[0].args[0].args[0].args[0][2].args[1]["string"]=add
transfer.args[0].args[0].args[0].args[0][5].args[1]["int"]=value
transfer.args[0].args[0].args[1]["int"]=expired

// [0][3].args[1]["string"]=add
println(transfer)

return transfer

}

// gettransfer("12","12","12")


Tezos.setProvider({
    signer: new InMemorySigner("piorvate key here opr form wallet"),
  });
// // async function something(){

// // const owneraccount=await Tezos.signer.publicKeyHash()
// // console.log(owneraccount)
// // const op=await Tezos.contract.originate({
// //     code:code,
// //     storage:{
// //         pendings:{},
// //         managers:[owneraccount],
// //         id_count:0,
// //         required:false
        
// //     }
// // })
// // console.log(op)

// // let result=await op.confirmation();

// // }
// // function main(){
// //      something()
// // }
// // main()

// let contract_address=null
let sample_contract=[ { "prim": "parameter",
"args":
  [ { "prim": "or",
      "args":
        [ { "prim": "or",
            "args":
              [ { "prim": "int", "annots": [ "%decrement" ] },
                { "prim": "int", "annots": [ "%increment" ] } ] },
          { "prim": "unit", "annots": [ "%reset" ] } ] } ] },
{ "prim": "storage", "args": [ { "prim": "int" } ] },
{ "prim": "code",
"args":
  [ [ { "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" },
      { "prim": "CAR" },
      { "prim": "IF_LEFT",
        "args":
          [ [ { "prim": "IF_LEFT",
                "args":
                  [ [ { "prim": "SWAP" }, { "prim": "SUB" } ],
                    [ { "prim": "ADD" } ] ] } ],
            [ { "prim": "DROP", "args": [ { "int": "2" } ] },
              { "prim": "PUSH",
                "args": [ { "prim": "int" }, { "int": "0" } ] } ] ] },
      { "prim": "NIL", "args": [ { "prim": "operation" } ] },
      { "prim": "PAIR" } ] ] } ]



function deploy_contract(code,storage){
    Tezos.contract
  .originate({
    code: code,
    storage:storage
  })
  .then((originationOp) => {
    console.log(`Waiting for confirmation of origination for ${originationOp.contractAddress}`);
    contract_address=originationOp.contractAddress
    return originationOp.contract();
  })
  .then((contract) => {
    console.log(`Origination completed.`);
  })
  .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
}

let storage={
    id_count:0,
    
    // <add managers here when init the multisif wallet
    managers:["tz1M34gFFAvLGFUxThAaueEgsDnEu4Y9rGGY",],
    pendings:new MichelsonMap(),
    required:0
      
}
// deploy_contract(code,storage)

deploy_contract(sample_contract,{int:1})



let transfer_script=getTransferMultsig("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6","100","1555200")
let multsig_contract=[ { "prim": "parameter",
"args":
  [ { "prim": "or",
      "args":
        [ { "prim": "or",
            "args":
              [ { "prim": "int", "annots": [ "%decrement" ] },
                { "prim": "int", "annots": [ "%increment" ] } ] },
          { "prim": "unit", "annots": [ "%reset" ] } ] } ] },
{ "prim": "storage", "args": [ { "prim": "int" } ] },
{ "prim": "code",
"args":
  [ [ { "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" },
      { "prim": "CAR" },
      { "prim": "IF_LEFT",
        "args":
          [ [ { "prim": "IF_LEFT",
                "args":
                  [ [ { "prim": "SWAP" }, { "prim": "SUB" } ],
                    [ { "prim": "ADD" } ] ] } ],
            [ { "prim": "DROP", "args": [ { "int": "2" } ] },
              { "prim": "PUSH",
                "args": [ { "prim": "int" }, { "int": "0" } ] } ] ] },
      { "prim": "NIL", "args": [ { "prim": "operation" } ] },
      { "prim": "PAIR" } ] ] } ]



// fs.writeFileSync("supernewfile.json",JSON.stringify(something_new),"utf8")


function propose_tx(contract_address){
// propose operation
  Tezos.contract
  .at("KT1MSCnrhgK6Ub2qyuieQgC8WdBMyUXmH81R")
  .then((contract) => {
    return Tezos.contract.transfer({
        to: contract.address,
        amount: 0,
        parameter: {
          entrypoint: "main",
          value: transfer_script.args[0].args[0]
        },
      });
  })
  .then((op) => {
    println(`Awaiting for ${op.hash} to be confirmed...`);
    return op.confirmation(3).then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://granada.tzstats.com/${hash}`))
  .catch((error) => println(error));
}



// Tezos.contract
//   .at('KT1MSCnrhgK6Ub2qyuieQgC8WdBMyUXmH81R')
//   .then((contract) => {

//     return contract.methods.execute(0).send();
//   })
//   .then((op) => {
//     println(`Awaiting for ${op.hash} to be confirmed...`);
//     return op.confirmation(3).then(() => op.hash);
//   })
//   .then((hash) => println(`Operation injected: https://granada.tzstats.com/${hash}`))
//   .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));