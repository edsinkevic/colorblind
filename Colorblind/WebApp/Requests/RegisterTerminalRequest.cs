using Domain.Commands.TerminalCommands;

namespace WebApp.Requests;

public record RegisterTerminalRequest(string Address, List<RegisterLockerDTO> Lockers);
