using Domain.Values;

namespace Domain.Commands.TerminalCommands;

public record RegisterTerminal(string Address, List<RegisterLockerDTO> Lockers);

public record RegisterLockerDTO(ParcelSize Size, int Count);
